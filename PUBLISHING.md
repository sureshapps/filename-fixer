# Make this package yours

1. Sign in to the npm account `sureshkaleyannan`. Create it at https://www.npmjs.com/signup if needed.
2. The package name is configured as `@sureshkaleyannan/filename-fixer`. Confirm that you control this scope and that the package name is available before publishing.
3. The author and MIT copyright holder are set to `sureshkaleyannan`.
4. Optionally add your real GitHub `repository`, `bugs`, and `homepage` URLs to package.json once you have a repository.
5. Run the checks:

```sh
npm install --package-lock-only
npm test
npm pack --dry-run
```

Inspect the package file list. Only `src`, `bin`, README.md, LICENSE and package.json should ship. There are no external dependencies or compiled files.

## Publish manually

From this package folder, authenticate and publish when you are ready:

```sh
npm login
npm whoami
npm publish --access public
```

npm requires account security for publishing: enable 2FA for direct interactive publishing. Follow any authentication prompts. Never commit credentials or tokens. Nothing in this project publishes automatically.

After publishing, verify using your actual scope:

```sh
npm view @sureshkaleyannan/filename-fixer
npx --package=@sureshkaleyannan/filename-fixer filename-fixer --help
```

For a later bug fix, commit your work, run `npm version patch`, and publish the new version. Published name/version pairs cannot be reused. Keep the CLI version string in bin/cli.js aligned with package.json when releasing.

Official publishing guide: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
