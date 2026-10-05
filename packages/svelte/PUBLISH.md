# How to publish **@chronohue/svelte**

|                  |                                             |
| ---------------- | ------------------------------------------- |
| **npm package**  | `@chronohue/svelte`                     |
| **Organization** | [igrs](https://www.npmjs.com/org/igrs)      |
| **GitHub**       | https://github.com/isamarin/chronohue-svelte |
| **peer**         | `chronohue`, `svelte` ^5               |

Same flow as ChronoHue: `NPM_TOKEN` on the repo, tag `vX.Y.Z` matching `package.json`.

```bash
npm version patch
git push origin main --tags
```
