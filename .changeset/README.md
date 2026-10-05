# Changesets

Run `pnpm changeset` in a PR that changes a published package, pick the
packages and the bump, and describe the change in one line. On merge to `main`
the Release workflow opens a "Version Packages" PR; merging that PR publishes
to npm with provenance.
