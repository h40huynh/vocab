# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Vocab File Format (Sense-based)

The app now uses one format only: one entry can contain multiple `sense` lines.

```text
# title: Communication Pack
# emoji: 💬

en: appreciate
ph: /əˈpriː.ʃi.eɪt/
topic: Communication
sub-topic: Feelings
sense: verb | transitive | to feel thankful for something | biết ơn hoặc trân trọng điều gì đó
example: |
  I really appreciate your help.
sense: verb | intransitive | to increase in value over time | tăng giá trị theo thời gian
example: |
  Property appreciates over time.

---

en: recover
ph: /rɪˈkʌv.ər/
topic: Health
sub-topic: Physical Health
sense: verb | intransitive | to become healthy again after illness or injury | hồi phục sau bệnh hoặc chấn thương
example: |
  She recovered quickly after surgery.
```

Supported fields:

- `en` or `english`: headword
- `ph` or `phonetic`: IPA/pronunciation
- `topic`: topic group
- `sub-topic` / `subtopic` / `sub_topic`: subgroup
- `sense`: `type | grammar | meaning_en | meaning_vi | example(optional)`
- `example` (or `ex`): example for the latest `sense`

Notes:

- `sense` requires both English and Vietnamese meanings.
- `grammar` can be values like `transitive`, `intransitive`, `countable`, or `-` if not applicable.
- `example: |` supports multiline markdown.

## Deploy to GitHub Pages (Branch)

This project includes a GitHub Actions workflow at `.github/workflows/deploy-pages-branch.yml`.

On every push to `main` or `master`, it will:

- Install dependencies and run `npm run build`
- Build with `VITE_BASE_PATH=/<repo-name>/` so static assets resolve correctly on project pages
- Publish `dist/` to the `gh-pages` branch

One-time setup in your repository:

- Go to Settings -> Pages
- Set Source to `Deploy from a branch`
- Select `gh-pages` branch and `/ (root)` folder
