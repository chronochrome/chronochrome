# How to publish **@igrs/circahue-bootstrap**

|                  |                                                |
| ---------------- | ---------------------------------------------- |
| **npm package**  | `@igrs/circahue-bootstrap`                     |
| **Organization** | [igrs](https://www.npmjs.com/org/igrs)         |
| **GitHub**       | https://github.com/isamarin/circahue-bootstrap |
| **peer**         | `@igrs/circahue`                               |

Same flow as CircaHue: `NPM_TOKEN` on the repo, tag `vX.Y.Z` matching `package.json`.

```bash
npm version patch
git push origin main --tags
```
