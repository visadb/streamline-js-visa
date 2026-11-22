# Release Process

This repo uses a GitHub Action (`.github/workflows/release.yml`) that builds a
sanitised snapshot of the skin from a whitelist of paths. Two triggers:

## `dist` branch — tracks `main`

Every push to `main` force-pushes a clean copy of the whitelist to the `dist`
branch. This is the bleeding-edge dev channel. Downstream tools that want to
follow main without waiting for a release can point at:

```
github_branch: <owner>/streamline-js@dist
```

The `dist` branch is orphan and force-pushed on every main update, so it
never accumulates history.

## Tagged releases

Push a tag matching `v*` to cut a release. Fork releases use the upstream
version they are based on plus a dotted, three-digit `-visa.NNN` counter that
restarts at `000` on each new upstream version:

```bash
git tag v0.2.31-visa.004
git push visadb v0.2.31-visa.004
```

Keep the dot: the skin's reload prompt ignores everything from a second `-`
on, so `-visa-009` and `-visa-010` would compare equal and never prompt, while
`-visa.009` < `-visa.010` compares numerically. Keep the width too: the
comparison ignores the zero padding, so `-visa.4` and `-visa.004` are the same
version.

The action:

1. Stages the whitelist into `./dist/`
2. **Rewrites** `dist/skin-manifest.json` `version` and `dist/src/version.js`
   `APP_VERSION` to the tag name with the leading `v` stripped (tag
   `v0.2.31-visa.004` → version `0.2.31-visa.004`). The git tag is the single
   source of truth for version; you do not have to bump either file before
   tagging.
3. Zips the staged whitelist as `streamline.js-visa-v0.2.31-visa.004.zip`
4. Publishes a GitHub Release with auto-generated notes

Downstream tools consume the release via:

```
github_release: <owner>/streamline-js
```

Note: the committed `skin-manifest.json` and `src/version.js` versions are
only rewritten inside the release artifact — the files on disk in `main` are
untouched. The `dist`
branch snapshot (for bleeding-edge dev) keeps the version as committed,
because tag-based auto-sync only runs on tag builds.

## Whitelist

Only these paths ship in the skin:

- `index.html`
- `skin-manifest.json`
- `src/` (contains `css/`, `modules/`, `profiles/`, `settings/`, `ui/`)

Anything else in the repo is **excluded by construction**, not by ignore
rules. This means future repo pollution (loose notes, AI agent configs,
experimental folders, etc.) cannot slip into releases without an explicit
change to the workflow.

To add a new top-level path, edit the `Stage whitelist into ./dist` step in
`.github/workflows/release.yml`.

## Validation

The workflow enforces two invariants before publishing:

1. `dist/skin-manifest.json` exists and declares `id == "streamline.js-visa"`
   (or `"streamline.js-visa-dist"` on dist builds) and a non-empty `version`
   field. This fork's id is deliberately distinct from upstream's
   `streamline.js` so both install side by side in Decaid.
2. No file in `dist/` has a Win32-reserved character (`< > : " | ? *`) in its
   name. Windows `CreateFile` rejects these with `ERROR_INVALID_NAME`, and
   any such file would crash skin installation on Windows.

A failure on either check stops the release cleanly.
