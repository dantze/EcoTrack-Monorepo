# ID scanning and photos

Moved out of `CLAUDE.md` so it is read only when relevant. Section headings are
unchanged, so a code comment that cites a CLAUDE.md section still finds its
text here — `CLAUDE.md`'s *Deeper reading* table maps each heading to this file.

## Scanning an ID — and why no photo is stored

Creating a *persoană fizică* offers **Scanează buletinul**, which fills `nume
complet` and `CNP` from a photo of the card (TODO-13). Two rules govern it, and
both are load-bearing.

**1. It reads the MRZ, not the card.** The three 30-character OCR-B lines at the
bottom of any ICAO 9303 TD1 document. Romania puts the CNP in line 1's
optional-data field; the name is line 3. That choice is what makes a free
recogniser sufficient — **the MRZ verifies itself**, via four ICAO check digits,
the CNP's own control digit (weights `279146358279`, mod 11, 10→1), and the fact
that the CNP restates the birth date and sex that line 2 states separately.

So: **a read either passes every one of those checks or is refused.** A card
whose document number smudged is rejected even though nothing uses the document
number — a failed check digit means something was misread and the parser cannot
say what. Refusing costs two fields of typing; a false accept writes a wrong CNP
into a client record nobody re-reads. **Do not "improve" this by accepting
partial reads.**

The parser lives once, in `web/src/features/sales/idScan/mrz.ts`. It existed
twice — a byte-identical copy in mobile, pinned to it by
`shared/id-mrz-cases.json` because the two projects cannot import each other —
until TODO-33 deleted the mobile Sales section. The fixture stays and is still
where a case is added; it now has one reader rather than two.

**2. The image never leaves the device and is never stored** (TODO-14). Web runs
tesseract.js in the browser. Nothing about an identity document is uploaded, so
`PhotosController`, both `/{clientId}/idPhoto` routes and `GET /api/photos` are
gone, and `idPhotoUrl` is off the wire. The scanner was on-device on the phone
too, via ML Kit, and that dependency went with the screen.

Holding rule 2 requires one non-obvious thing: **tesseract.js defaults
`workerPath`, `corePath` and `langPath` to jsDelivr.** Unset, they would put a
third party in the request path of an ID scan. `web/scripts/fetch-ocr-assets.mjs`
puts the engine in `web/public/tesseract/` (copied from `node_modules`, plus a
checksum-verified language model) and `ocr.ts` points all three at our own
origin. `ocrIsLazy.test.ts` fails if any of them is dropped, if the file names
any `http` host, or if the ~6 MB engine stops being dynamically imported.

Same rule as the map, in the other direction: `src/lib/geocoding.ts` keeps our
bearer token off someone else's host; this keeps someone else's host out of our
scanner.

**That follow-up is closed** (TODO-45). `Individual.idPhotoUrl`,
`IndividualRepository` and the `/api/admin/id-photos` purge endpoint are
deleted: the owner confirmed no photos were ever uploaded, and no committed
database ever held a stored URL. **One thing was deliberately kept — the
prefix.** ID photos were written under **`persoane fizice/`**, with the space,
and `DEPLOYMENT.md` still carries it with a keys-only `aws s3 ls`. That is what
makes a stray object findable now that nothing in the database points at one; it
is the safety net that made deleting the column acceptable. The database COLUMN
still exists — `ddl-auto=update` never drops — and the manual DDL is in
`DEPLOYMENT.md` too.

**Task photos live in a GCS bucket, with no credential anywhere** (TODO-79).
`PhotoService` uses `google-cloud-storage` and Application Default Credentials,
so on Cloud Run it authenticates as the runtime service account, which holds
`objectAdmin` on that one bucket. The DigitalOcean Spaces key pair — the last
thing keeping a non-GCP dependency alive, and the only reason
`BACKEND_SECRETS_JSON` had to exist — is gone. **The bucket's own settings are
the privacy guarantee**: `uniform_bucket_level_access` refuses per-object ACLs
outright and `public_access_prevention = "enforced"` refuses a public IAM
binding, so an object cannot be made world-readable by a code change.

One binding is easy to miss and breaks reads only: V4 signing has no private key
to sign with, so it goes through the IAM `signBlob` API and the runtime service
account holds **`roles/iam.serviceAccountTokenCreator` on itself**. Remove it and
uploads keep working while every photo link starts failing.

**Photos are served as short-lived signed URLs** (TODO-46).
`GET /api/tasks/{id}/photos` signs a link per request rather than
returning the stored URL. Two consequences that are easy to get wrong:

- **The signature carries the access, so the guard on the endpoint is the whole
  authorisation.** `requireCanAccessTask` runs first; a signed URL needs no token,
  so anything that hands one out without an equivalent check grants access
  nothing downstream can withhold.
- **The URLs expire, so no client may persist one.** Web's `useTaskPhotos` sets
  no `staleTime` and mobile's `CloudPhotoViewer` holds them in component state —
  both correct today, and both load-bearing. The stored `task_photos.image_url`
  stays the canonical, unsigned identity of the object.

This was not a theoretical exposure: the object key is
`poze cabine/{taskId}_{clientName}/{n}`, so a public URL named a customer and its
last segment counted from 1 — one leaked link walked that client's other photos.
The GCS bucket is new and has never held a public object; what may still hold
one is the old Spaces bucket, which `DEPLOYMENT.md` decommissions.

