# How to publish **@igrs/circahue-svelte**

|                  |                                             |
| ---------------- | ------------------------------------------- |
| **npm package**  | `@igrs/circahue-svelte`                     |
| **Organization** | [igrs](https://www.npmjs.com/org/igrs)      |
| **GitHub**       | https://github.com/isamarin/circahue-svelte |
| **peer**         | `@igrs/circahue`, `svelte` ^5               |

Same flow as CircaHue: `NPM_TOKEN` on the repo, tag `vX.Y.Z` matching `package.json`.

```bash
npm version patch
git push origin main --tags
```
