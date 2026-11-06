#!/usr/bin/env python3
"""Repo-wide hygiene checks that the three path-filtered CI workflows cannot do.

ci-backend / ci-web / ci-mobile each carry a `paths:` filter — that filtering is
load-bearing (CLAUDE.md: it is the reason three independently deployed projects
can share one repo), but it also means a change outside all three filters gets
no CI at all. This script runs on EVERY pull request to cover that hole.

Unlike junit_summary.py and jacoco_summary.py, which always exit 0 because the
Gradle step is what fails the job, **this script's exit code is the point**. It
exits 1 when a check fails.

Runs locally exactly as it runs in CI:

    git diff --name-only origin/main... | python3 .github/scripts/repo_hygiene.py
    python3 .github/scripts/repo_hygiene.py --changed-files <(git diff --name-only origin/main...)
"""

from __future__ import annotations

import argparse
import fnmatch
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
WORKFLOW_DIR = REPO_ROOT / ".github" / "workflows"
# Findings this scanner is RIGHT about but that must stay, as (path, check-name).
# Empty since TODO-93 removed the Firebase config that was the only entry - the
# app never used Firebase. Add one only with a reason, and delete it the moment
# it stops being true.
ALLOWED_FINDINGS: set[tuple[str, str]] = set()

# Top-level entries that legitimately have no CI workflow watching them.
# Anything NOT here and NOT matched by a CI `paths:` filter fails check 2 —
# the fix is either to add a workflow or to add an entry here with a reason.
NO_CI_REQUIRED = {
    ".github",          # workflows themselves; this script is their check
    ".gitignore",
    ".claude",          # agent instructions (skills); prose, ships in no build
    # Skills installed from upstream by `npx skills add` (shadcn/ui, Mantine).
    # `.claude/skills/*` are symlinks INTO here, so this is the same category
    # as `.claude`: prose and agent instructions, read by no build step. The
    # lock file records which versions were installed.
    ".agents",
    "skills-lock.json",
    "CLAUDE.md",
    # docs/architecture/*.md is CLAUDE.md's detail, split out so it is read on
    # demand. Prose, ships in no build; doc_claims.py checks it on every PR.
    "docs",
    "README.md",
    # The backlog. Prose, and it ships in no build - but "no CI workflow"
    # stopped being true of it: repo-hygiene.yml's "TODO.md index" step runs
    # todo_index.py on every PR, holding the hand-maintained Index and
    # 'Still open' list at the top of the file to the items below it (TODO-50).
    # Same shape as the compose-file exemption below: exempt from the ci-*.yml
    # requirement because it is covered by a check with no `paths:` filter.
    "TODO.md",
    "DEPLOYMENT.md",    # the runbook; prose, ships in no build
    # docker-compose.yml is still load-bearing, as the only way to run the
    # backend against real Postgres locally (it stopped being a deployment in
    # TODO-71 and lost its web + Caddy half in TODO-91), and no ci-*.yml
    # validates it, because repo-hygiene.yml does instead. Its
    # "Validate compose files" step runs `docker compose config -q` on every
    # docker-compose*.yml on every PR, which resolves interpolation and
    # validates the Compose schema, not just the YAML (TODO-29). It is exempt
    # from the ci-*.yml requirement because it is covered - by a check with no
    # `paths:` filter, which is stronger than a fourth ci-*.yml would have been.
    "docker-compose.yml",
}
NO_CI_REQUIRED_GLOBS = ("HANDOFF-*.md",)

# Filenames that should never be committed, whatever they contain.
SECRET_FILENAME_GLOBS = (
    ".env", ".env.*",
    "*.pem", "*.key", "*.p12", "*.pfx", "*.jks", "*.keystore",
    "id_rsa", "id_dsa", "id_ecdsa", "id_ed25519",
    "google-services.json", "GoogleService-Info.plist",
    "*serviceaccount*.json", "*service-account*.json",
)
# Templates are the whole point of committing an env file.
SECRET_FILENAME_EXCEPTIONS = (".env.example", ".env.sample", ".env.template")

# High-confidence credential shapes. Assembled from parts so this file does not
# trip its own scan.
SECRET_CONTENT_PATTERNS = {
    "google-api-key": re.compile("AIza" + r"[0-9A-Za-z\-_]{35}"),
    "aws-access-key-id": re.compile("AKIA" + r"[0-9A-Z]{16}"),
    "github-pat": re.compile("ghp" + r"_[A-Za-z0-9]{36}"),
    "private-key-block": re.compile("-----BEGIN" + r" [A-Z ]*PRIVATE KEY-----"),
    "slack-token": re.compile("xox" + r"[baprs]-[0-9A-Za-z-]{10,}"),
}
# Binary/vendored trees are never worth scanning.
CONTENT_SCAN_SKIP_DIRS = ("node_modules/", "build/", "dist/", ".git/")
CONTENT_SCAN_MAX_BYTES = 512 * 1024

errors: list[str] = []
warnings: list[str] = []


def annotate(level: str, path: str, message: str, line: int | None = None) -> None:
    """Emit a GitHub workflow command so the finding lands on the changed line."""
    where = f"file={path}" + (f",line={line}" if line else "")
    print(f"::{level} {where}::{message}")
    (errors if level == "error" else warnings).append(f"`{path}` — {message}")


def workflow_path_filters() -> dict[str, list[str]]:
    """The `paths:` filters of every ci-*.yml, so we know what CI actually watches."""
    try:
        import yaml
    except ImportError:
        print("::warning::PyYAML unavailable; skipping the CI-coverage check.")
        return {}

    filters: dict[str, list[str]] = {}
    for wf in sorted(WORKFLOW_DIR.glob("ci-*.yml")):
        data = yaml.safe_load(wf.read_text(encoding="utf-8")) or {}
        # YAML 1.1 parses a bare `on:` key as the boolean True. Both spellings.
        triggers = data.get("on", data.get(True)) or {}
        if not isinstance(triggers, dict):
            continue
        found: list[str] = []
        for event in ("pull_request", "push"):
            cfg = triggers.get(event) or {}
            if isinstance(cfg, dict):
                found.extend(cfg.get("paths") or [])
        if found:
            filters[wf.name] = found
    return filters


def path_matches(path: str, pattern: str) -> bool:
    """Approximates GitHub's filter syntax: `dir/**` is a prefix, the rest is fnmatch."""
    if pattern.endswith("/**"):
        return path.startswith(pattern[:-2])
    if pattern.endswith("**"):
        return path.startswith(pattern[:-2])
    return fnmatch.fnmatch(path, pattern)


def check_secret_filenames(changed: list[str], allowed: set[tuple[str, str]]) -> None:
    for path in changed:
        # DELETING one of these is the fix, not the offence. `git diff
        # --name-only` lists a removal like any other change, so without this the
        # scanner fails the PR that takes a credential OUT of the repo
        # (found removing mobile/google-services.json, TODO-93).
        if not (REPO_ROOT / path).exists():
            continue
        name = os.path.basename(path)
        if name in SECRET_FILENAME_EXCEPTIONS:
            continue
        if (path, "secret-filename") in allowed:
            continue
        for glob in SECRET_FILENAME_GLOBS:
            if fnmatch.fnmatch(name.lower(), glob.lower()):
                annotate(
                    "error", path,
                    f"looks like key material or an environment file ({glob}). "
                    "Do not commit it; add it to .gitignore. If this is a template, "
                    "name it .env.example.",
                )
                break


def check_secret_contents(changed: list[str], allowed: set[tuple[str, str]]) -> None:
    for path in changed:
        if any(skip in path for skip in CONTENT_SCAN_SKIP_DIRS):
            continue
        # This file holds the patterns themselves.
        if path == ".github/scripts/repo_hygiene.py":
            continue
        full = REPO_ROOT / path
        if not full.is_file() or full.stat().st_size > CONTENT_SCAN_MAX_BYTES:
            continue
        try:
            text = full.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        for lineno, line in enumerate(text.splitlines(), start=1):
            for name, pattern in SECRET_CONTENT_PATTERNS.items():
                if pattern.search(line):
                    if (path, name) in allowed:
                        continue
                    annotate(
                        "error", path,
                        f"contains something shaped like a live credential ({name}). "
                        "Rotate it and remove it. If it genuinely has to stay, add it to "
                        "ALLOWED_FINDINGS at the top of this script, with a reason.",
                        line=lineno,
                    )


def check_ci_coverage(changed: list[str]) -> None:
    filters = workflow_path_filters()
    if not filters:
        return
    every_pattern = [p for patterns in filters.values() for p in patterns]

    uncovered: list[str] = []
    for path in changed:
        # A DELETED path needs no workflow. `git diff --name-only` lists it just
        # like a changed one, so without this, removing a file whose top-level
        # entry was in NO_CI_REQUIRED fails the check for the entry that was
        # correctly removed with it (found deleting the Caddyfile, TODO-91).
        if not (REPO_ROOT / path).exists():
            continue
        if any(path_matches(path, pattern) for pattern in every_pattern):
            continue
        top = path.split("/", 1)[0]
        if top in NO_CI_REQUIRED:
            continue
        if any(fnmatch.fnmatch(top, glob) for glob in NO_CI_REQUIRED_GLOBS):
            continue
        uncovered.append(path)

    for path in sorted(set(uncovered)):
        annotate(
            "error", path,
            "is not matched by any ci-*.yml `paths:` filter, so no CI workflow runs "
            "for it. Either add a workflow (or extend a filter), or add its top-level "
            "directory to NO_CI_REQUIRED in .github/scripts/repo_hygiene.py.",
        )


def check_action_pins() -> None:
    """A third-party action on @main/@master is whatever its author pushed today."""
    uses = re.compile(r"^\s*(?:-\s*)?uses:\s*([^\s#]+)")
    for wf in sorted(WORKFLOW_DIR.glob("*.yml")):
        rel = str(wf.relative_to(REPO_ROOT))
        for lineno, line in enumerate(wf.read_text(encoding="utf-8").splitlines(), start=1):
            match = uses.match(line)
            if not match:
                continue
            ref = match.group(1)
            if ref.startswith("./"):  # local reusable workflow, pinned by definition
                continue
            if ref.endswith("@main") or ref.endswith("@master"):
                annotate(
                    "error", rel,
                    f"`{ref}` is pinned to a moving branch. Pin a release tag "
                    "(e.g. @v4) or a full commit SHA.",
                    line=lineno,
                )


def check_vendor_migrations() -> None:
    """A vendor-split Flyway migration must exist for EVERY database, not one.

    Almost every migration is portable and lives in db/migration/common. The
    exceptions - where H2 and Postgres genuinely disagree, like retyping a
    varchar column to date - are written twice, once per vendor folder, with the
    same version.

    That duplication has a specific failure mode nothing else catches: the test
    suite runs on H2, so a migration added ONLY to h2/ is fully green here and
    breaks the first Postgres boot, which is production. The reverse is quieter
    still - a migration added only to postgresql/ leaves the test database
    without a change every test then passes without.

    So: for each version present in any vendor folder, require it in all of
    them. This says nothing about the two files being equivalent, which no
    checker could decide; it catches the omission, which is the mistake actually
    made.
    """
    vendor_root = REPO_ROOT / "backend" / "src" / "main" / "resources" / "db" / "migration"
    if not vendor_root.is_dir():
        return

    vendors = sorted(d.name for d in vendor_root.iterdir() if d.is_dir() and d.name != "common")
    if len(vendors) < 2:
        return

    version_of = re.compile(r"^V(\d+(?:[._]\d+)*)__")
    per_vendor: dict[str, set[str]] = {}
    for vendor in vendors:
        per_vendor[vendor] = {
            m.group(1)
            for f in (vendor_root / vendor).glob("V*.sql")
            if (m := version_of.match(f.name))
        }

    for vendor, versions in per_vendor.items():
        for other, other_versions in per_vendor.items():
            if other == vendor:
                continue
            for missing in sorted(versions - other_versions):
                annotate(
                    "error",
                    f"backend/src/main/resources/db/migration/{other}",
                    f"migration V{missing} exists in `{vendor}/` but not in `{other}/`. "
                    "A vendor-split migration must be written for every database, "
                    "or that database boots against a schema the others do not have.",
                )


def write_summary(changed: list[str]) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return
    lines = ["## Repo hygiene", "", f"Checked {len(changed)} changed file(s).", ""]
    if errors:
        lines.append(f"### ❌ {len(errors)} problem(s)")
        lines.extend(f"- {e}" for e in errors)
    else:
        lines.append("### ✅ No problems found")
    if warnings:
        lines.append("")
        lines.append(f"### ⚠️ {len(warnings)} warning(s)")
        lines.extend(f"- {w}" for w in warnings)
    with open(summary_path, "a", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--changed-files",
        help="File containing newline-separated changed paths. Defaults to stdin.",
    )
    args = parser.parse_args()

    source = open(args.changed_files, encoding="utf-8") if args.changed_files else sys.stdin
    with source as handle:
        changed = [line.strip() for line in handle if line.strip()]

    check_secret_filenames(changed, ALLOWED_FINDINGS)
    check_secret_contents(changed, ALLOWED_FINDINGS)
    check_ci_coverage(changed)
    check_action_pins()
    check_vendor_migrations()

    write_summary(changed)

    if errors:
        print(f"\nrepo-hygiene: {len(errors)} problem(s) found.", file=sys.stderr)
        return 1
    print(f"repo-hygiene: OK ({len(changed)} file(s) checked, {len(warnings)} warning(s)).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
