# How to publish **@igrs/circahue-tailwind**

|                  |                                               |
| ---------------- | --------------------------------------------- |
| **npm package**  | `@igrs/circahue-tailwind`                     |
| **Organization** | [igrs](https://www.npmjs.com/org/igrs)        |
| **GitHub**       | https://github.com/isamarin/circahue-tailwind |
| **peer**         | `@igrs/circahue`                              |

Same flow as CircaHue: `NPM_TOKEN` on the repo, tag `vX.Y.Z` matching `package.json`.

```bash
npm version patch
git push origin main --tags
```
