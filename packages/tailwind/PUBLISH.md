# How to publish **@chronohue/tailwind**

|                  |                                               |
| ---------------- | --------------------------------------------- |
| **npm package**  | `@chronohue/tailwind`                     |
| **Organization** | [igrs](https://www.npmjs.com/org/igrs)        |
| **GitHub**       | https://github.com/isamarin/chronohue-tailwind |
| **peer**         | `chronohue`                              |

Same flow as ChronoHue: `NPM_TOKEN` on the repo, tag `vX.Y.Z` matching `package.json`.

```bash
npm version patch
git push origin main --tags
```
