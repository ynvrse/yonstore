# Yonstore

Simple Point of Sale app using React + vitePWA + typescript + shadcn/ui.

## Getting Started

```
git clone https://github.com/ynvrse/yonstore.git new-project
cd new-project
npm install
npm run dev
```

## Getting Done

- [x] Single page app with navigation and responsif layout

- [x] Customable configuration `/config`

- [x] Simple starting page/feature `/pages`

- [x] Github action deploy github pages

## Deploy `gh-pages`

- change `basenameProd` in `/vite.config.ts`
- create deploy key `GITHUB_TOKEN` in github `/settings/keys`
- commit and push changes code
- setup github pages to branch `gh-pages`
- run action `Build & Deploy`

### Auto Deploy

- change file `.github/workflows/build-and-deploy.yml`
- Uncomment on `push`
- Comment on `workflow_dispatch`

```yaml
on:
    push:
        branches: ['main']
    # workflow_dispatch:
```

## Features

- React + Vite + PWA + TypeScript
- Progressive Web App
- Tailwind CSS
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [shadcn-ui](https://github.com/shadcn-ui/ui/)
- [radix-ui/icons](https://www.radix-ui.com/icons)
- [vite-pwa](https://vite.dev/guide/performance.html#audit-configured-vite-plugins)

## Project Structure

```
react-shadcn-starter/
├── public/            # Public assets
├── src/               # Application source code
│   ├── components/    # React components
│   │   └── ui/        # shadc/ui components
│   │   └── layouts/   # layouts components
│   ├── context/       # contexts components
│   ├── config/        # Config data
│   ├── hook/          # Custom hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # pages/features components
│   ├── App.tsx        # Application entry point
│   ├── index.tsx      # Main rendering file
│   └── Router.tsx     # Routes component
├── index.html         # HTML entry point
├── postcss.config.js  # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/ynvrse/react-pwa-starter/blob/main/LICENSE) file for details.
