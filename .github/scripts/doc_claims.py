#!/usr/bin/env python3
"""Documentation that makes checkable claims must still be true.

CLAUDE.md is the reference for how this repo works, and the skills in
.claude/skills are instructions an agent follows literally. Both go stale
silently: nothing compiles them, and a wrong pointer is worse than no pointer
because it is followed confidently.

This has already bitten twice, which is why the script exists:

  - CLAUDE.md documented `ecotrack.security.enforce` as defaulting to `false`
    long after it was changed to `true`, in the section that calls itself "the
    single most important thing to understand before touching auth".
  - a javadoc pointed at the web file that used to hold a mirrored rule, after
    that rule moved elsewhere — stale within the same afternoon it was written.
    Note this passed a path check: the file still existed, the FUNCTION had
    moved. That is why check 4 pins symbols, not just paths.

Two checks:
  1. every repo path named in the docs, and in source comments, resolves
  2. pinned numeric/string claims match the property files they describe

TODO.md is deliberately NOT path-checked: it is a historical log that refers to
deleted files on purpose ("`DriversPage.tsx` is gone").

Dependency-free — runs from repo-hygiene.yml before any toolchain is installed.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SKIP_DIRS = {".git", "node_modules", "build", "dist", ".gradle", "__pycache__"}
SOURCE_SUFFIXES = (".java", ".ts", ".tsx", ".py", ".yml", ".yaml", ".json", ".properties", ".md")

failures: list[str] = []


def repo_files() -> set[str]:
    found = set()
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file():
            # as_posix(), not str(): on Windows str() yields backslashes and
            # every "/"-shaped claim in the repo fails to resolve, which turns
            # the documented local run into ~25 false failures while CI stays
            # green. The paths this script compares against are written with
            # forward slashes by definition.
            found.add(path.relative_to(ROOT).as_posix())
    return found


ALL_FILES = repo_files()
ALL_DIRS = {Path(f).parent.as_posix() for f in ALL_FILES}


ALIASES = {
    "web": "web/src",      # `@/` -> src/   in web
    "mobile": "mobile",    # `@/` -> project root in mobile
}


def _suffix_match(candidate: str) -> bool:
    needle = "/" + candidate
    return candidate in ALL_FILES or any(f.endswith(needle) for f in ALL_FILES)


def resolves(token: str, from_file: str | None = None) -> bool:
    """Does this path reference point at something that exists?

    Handles the three ways this repo writes paths, all of which a naive
    existence check gets wrong:

      - `@/lib/orderLifecycle.ts` — the alias, which means `web/src/` in web
        and the project root in mobile (CLAUDE.md, Conventions)
      - `./enrollment.ts` — relative to the file whose comment names it
      - `backend/.../service/Foo.java` — a deliberately elided middle

    Docs also legitimately abbreviate, writing `service/TaskAccessPolicy.java`
    for the full package path, so a tail match is the honest rule. It still
    fails when the file is renamed or deleted, which is the case that matters.
    """
    token = token.strip().rstrip("/")
    token = re.sub(r"/\*\*?$", "", token)
    if not token:
        return True

    # `backend/.../service/Foo.java` — keep only the unambiguous tail.
    if "/.../" in token:
        token = token.split("/.../")[-1]

    if token.startswith("@/"):
        rest = token[2:]
        roots = list(ALIASES.values())
        if from_file:
            project = from_file.split("/")[0]
            if project in ALIASES:
                roots = [ALIASES[project]]
        return any(f"{root}/{rest}" in ALL_FILES for root in roots)

    # Only "./" and "../" are relative. A leading dot alone is a hidden
    # directory (`.github/workflows/ci-web.yml`), which is an ordinary path.
    if (token.startswith("./") or token.startswith("../")) and from_file:
        base = Path(from_file).parent
        try:
            resolved = (ROOT / base / token).resolve().relative_to(ROOT)
        except (ValueError, OSError):
            return False
        return resolved.as_posix() in ALL_FILES

    return _suffix_match(token)


# ---------------------------------------------------------------------------
# 1. Paths named in prose
# ---------------------------------------------------------------------------

# Only inside backticks — these docs consistently quote paths that way — and
# only tokens ending in a real source suffix. A backticked `components/domain`
# or `DomainTests/OrderJsonSubTypesTest` is a directory or a class reference,
# not a filename, and guessing at those produces noise rather than signal.
BACKTICKED = re.compile(r"`([^`\n]+)`")
PATHLIKE = re.compile(r"^[@\w./*-]+$")

# CLAUDE.md is the short index; the detail it used to hold moved, with its
# headings unchanged, into docs/architecture/*.md. Those files are the same
# reference split up, so they get every check CLAUDE.md gets.
ARCH_DOCS = sorted(
    p.relative_to(ROOT).as_posix() for p in (ROOT / "docs" / "architecture").glob("*.md")
)
doc_files = ["CLAUDE.md"] + ARCH_DOCS + sorted(
    p.relative_to(ROOT).as_posix() for p in (ROOT / ".claude" / "skills").rglob("*.md")
)

for rel in doc_files:
    path = ROOT / rel
    if not path.is_file():
        continue
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        for token in BACKTICKED.findall(line):
            token = token.strip()
            if not PATHLIKE.match(token):
                continue
            if not re.sub(r"/\*\*?$", "", token.rstrip("/")).endswith(SOURCE_SUFFIXES):
                continue
            if not resolves(token, rel):
                failures.append(f"{rel}:{line_no}: names `{token}`, which does not exist")


# ---------------------------------------------------------------------------
# 2. Paths named in source comments — the stale-javadoc case
# ---------------------------------------------------------------------------

COMMENT_PATH = re.compile(r"[@\w./-]*[\w.-]+\.(?:java|ts|tsx|json|properties)\b")

for rel in sorted(ALL_FILES):
    if not rel.endswith((".java", ".ts", ".tsx")) or "/node_modules/" in rel:
        continue
    text = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
    for line_no, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        if not stripped.startswith(("*", "//", "/*")):
            continue
        for token in COMMENT_PATH.findall(line):
            if "/" not in token:
                continue  # a bare `Foo.java` is a class reference, not a path
            if not resolves(token, rel):
                failures.append(
                    f"{rel}:{line_no}: comment points at `{token}`, which does not exist"
                )


# ---------------------------------------------------------------------------
# 3. Pinned claims — a documented value must match the property it describes
# ---------------------------------------------------------------------------

PROPS = ROOT / "backend/src/main/resources/application.properties"
CLAUDE_MD = ROOT / "CLAUDE.md"

# Prose wraps across lines, so a claim like "30-minute\naccess" must be matched
# against a whitespace-normalised copy or every pin is a false failure.
# The pins apply to the reference as a whole — CLAUDE.md plus the architecture
# files it was split into — since a claim moving between them is not a change.
CLAUDE_TEXT = "\n".join(
    (ROOT / rel).read_text(encoding="utf-8")
    for rel in ["CLAUDE.md"] + ARCH_DOCS
    if (ROOT / rel).is_file()
)
CLAUDE_FLAT = re.sub(r"\s+", " ", CLAUDE_TEXT)
# Emphasis lands anywhere in a claim ("**365-day**", "**defaults to `true`**"),
# so pin against a copy with the markers removed rather than trying to spell
# every placement in each regex.
CLAUDE_PLAIN = CLAUDE_FLAT.replace("*", "").replace("`", "")


def property_value(key: str) -> str | None:
    if not PROPS.is_file():
        return None
    for line in PROPS.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line.startswith(f"{key}="):
            return line.split("=", 1)[1].strip()
    return None


# CLAUDE.md deliberately does NOT restate most numbers — it says to read them
# from application.properties rather than hardcoding a copy, which is the right
# call: a number that lives in one place cannot disagree with itself.
#
# So the rule here is not "the doc must state the value". It is: **if the doc
# states a value, it must be the real one.** Silence passes; a stale copy fails.
# That way tightening the prose never fails the build, and drifting never passes.
#
# (property key, regex with ONE capturing group for the number, human hint)
PINNED = [
    (
        "ecotrack.security.refresh-token-ttl-days",
        r"(\d+)-day rotating refresh",
        "the Tokens paragraph's refresh-token lifetime",
    ),
    (
        "ecotrack.security.access-token-ttl-minutes",
        r"(\d+)-minute access",
        "the Tokens paragraph's access-token lifetime",
    ),
]

# Verbatim strings that must appear if the property exists at all — used where
# the doc quotes the property expression itself rather than paraphrasing it.
PINNED_VERBATIM = [
    (
        "ecotrack.security.enforce",
        "the enforcement-flag table must quote the real default, verbatim",
    ),
]

if CLAUDE_MD.is_file():
    for key, pattern, hint in PINNED:
        value = property_value(key)
        if value is None:
            failures.append(
                f"application.properties no longer defines `{key}`, which doc_claims.py pins"
            )
            continue
        for stated in re.findall(pattern, CLAUDE_PLAIN):
            if stated != value:
                failures.append(
                    f"CLAUDE.md says `{stated}` where application.properties says `{value}` "
                    f"for `{key}` — {hint}"
                )

    for key, hint in PINNED_VERBATIM:
        value = property_value(key)
        if value is None:
            failures.append(
                f"application.properties no longer defines `{key}`, which doc_claims.py pins"
            )
        elif value not in CLAUDE_PLAIN:
            failures.append(
                f"CLAUDE.md does not quote the real value of `{key}` (`{value}`) — {hint}"
            )


# ---------------------------------------------------------------------------
# 4. Pinned cross-references — a pointer must name a file that still HOLDS it
# ---------------------------------------------------------------------------

# Check 2 only proves the referenced file exists. That is not enough, and the
# case that motivated this script proves it: OrderFulfilmentPolicy's javadoc
# pointed at `web/src/features/map/data.ts`, which still exists — the FUNCTION
# had moved out of it to `web/src/lib/orderLifecycle.ts`. A path check passes
# happily while the pointer sends the next reader to the wrong file.
#
# So for the references that actually matter, pin the symbol too: the named
# file must exist AND define what the pointer claims is there.
#
# (file that points, string it must contain, file pointed at, symbols that file must define)
CROSS_REFERENCES = [
    # "Live orders that block deleting a subscription" and "current orders that
    # stay out of the archive" are one question answered twice — once in JPQL,
    # once in TypeScript. Both sides name the other in a comment; these pins
    # make those names break loudly instead of quietly going stale.
    (
        "web/src/features/sales/orderModel.ts",
        "findLiveBySubscriptionId",
        "backend/src/main/java/com/example/damiProd/repository/OrderRepository.java",
        ["findLiveBySubscriptionId"],
    ),
    (
        "backend/src/main/java/com/example/damiProd/repository/OrderRepository.java",
        "deriveLifecycle",
        "web/src/features/map/data.ts",
        ["deriveLifecycle"],
    ),
]

for source_rel, mention, target_rel, symbols in CROSS_REFERENCES:
    source = ROOT / source_rel
    target = ROOT / target_rel
    if not source.is_file():
        failures.append(f"{source_rel} is gone — it is half of a pinned cross-reference")
        continue
    if mention not in source.read_text(encoding="utf-8", errors="replace"):
        failures.append(
            f"{source_rel} no longer mentions `{mention}`. It is one half of a rule "
            f"implemented twice, in two languages, with no reference between them — if the "
            f"other half moved or was renamed, update the comment rather than dropping it."
        )
        continue
    if not target.is_file():
        failures.append(f"{source_rel} points at `{target_rel}`, which does not exist")
        continue
    target_text = target.read_text(encoding="utf-8", errors="replace")
    for symbol in symbols:
        if symbol not in target_text:
            failures.append(
                f"{source_rel} points at `{target_rel}` for `{symbol}`, but that file does not "
                f"define it — the pointer is stale even though the path still resolves"
            )


# ---------------------------------------------------------------------------

if failures:
    print("\ndoc-claims: FAILED\n")
    for failure in failures:
        print(f"  ✗ {failure}")
    print("\nDocs are followed literally by both humans and agents. Fix the doc, or the code.")
    sys.exit(1)

print(
    f"doc-claims: OK ({len(doc_files)} doc file(s), "
    f"{len(PINNED) + len(PINNED_VERBATIM)} pinned claim(s), "
    f"{len(CROSS_REFERENCES)} cross-reference(s), 0 problems)."
)
