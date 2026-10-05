# Publishing chronochrome

|                   |                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| **Core**          | `chronochrome` (unscoped)                                                                           |
| **Adapters**      | `@chronochrome/tailwind`, `@chronochrome/svelte`, `@chronochrome/bootstrap`, `@chronochrome/widget` |
| **npm org**       | `chronochrome` (covers `@chronochrome/*`)                                                           |
| **GitHub**        | https://github.com/chronochrome/chronochrome                                                        |
| **Previous name** | `@igrs/circahue` (0.1.1 on npm) — deprecate after the first release, see §4                         |

---

## 1. One-time setup

1. Create the npm organization **`chronochrome`** and enable 2FA on the account.
2. Issue a granular npm token with **Read and write** on package `chronochrome`
   and organization `chronochrome`. Store it as repo secret **`NPM_TOKEN`**
   (Settings → Secrets and variables → Actions).

   The old `NPM_TOKEN` was scoped to `@igrs/*` only. Left in place, the Release
   workflow fails at the publish step with a 403 — after a green quality gate,
   so it looks like a fluke rather than a permissions problem.

3. Settings → Actions → General → Workflow permissions: allow GitHub Actions
   to **create and approve pull requests** (changesets opens the Version PR).

Local check:

```bash
npm whoami                 # must not 401
npm org ls chronochrome    # confirms publish rights on the scope
```

---

## 2. Everyday release flow (Changesets)

```bash
pnpm changeset             # in your feature branch: pick packages, bump, one-line summary
git add .changeset && git commit
```

- Merge to `main` → **Release** workflow runs `pnpm quality`, then opens or
  updates a **Version Packages** PR (bumps versions, writes CHANGELOGs,
  updates peer ranges of dependents).
- Merge the Version PR → Release workflow publishes every package whose version
  is not on npm yet, with `--provenance`, and pushes `<name>@<version>` tags.

> **First run:** none of the packages are on npm yet, so the first push to
> `main` with a valid `NPM_TOKEN` publishes all five at their current versions
> (`chronochrome@1.0.0`, adapters and widget `0.1.0`).

---

## 3. Manual publish (fallback)

```bash
pnpm install --frozen-lockfile
pnpm quality
pnpm release               # build + changeset publish
```

`workspace:^` ranges are rewritten to real versions at pack time — never run
plain `npm publish` inside a package directory.

---

## 4. Retire the old name and repoint consumers

After `chronochrome@1.0.0` is live:

```bash
npm deprecate "@igrs/circahue@*" "Renamed to chronochrome — npm i chronochrome"
```

Do not unpublish: deprecation keeps existing installs working and prints the new
name on install.

Then repoint the known consumers (`lri-drop`, `blacklight/packages/desktop-tauri`):
replace the old dependency with `"chronochrome": "^1"`, update imports to
`from "chronochrome"`, regenerate lockfiles and confirm both builds pass.

---

## 5. Defensive aliases (optional)

`circadian-hue`, `circadian-colors`, `circadian-color` are free. Publishing each
as a stub whose README points at `chronochrome` catches people searching the
descriptive term.

---

## 6. Install / CDN

```bash
npm install chronochrome
```

| Channel  | URL                                                |
| -------- | -------------------------------------------------- |
| npm      | https://www.npmjs.com/package/chronochrome         |
| jsDelivr | `https://cdn.jsdelivr.net/npm/chronochrome@1/+esm` |
| unpkg    | `https://unpkg.com/chronochrome@1/dist/index.js`   |

---

## 7. Checklist

- [ ] npm org `chronochrome` created; `NPM_TOKEN` replaced with one that covers it
- [ ] Actions allowed to create pull requests
- [ ] First release published; package pages render
- [ ] `@igrs/circahue` deprecated with a pointer to `chronochrome`
- [ ] `lri-drop` and `blacklight` repointed, builds pass
