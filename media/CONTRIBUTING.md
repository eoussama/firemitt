# Contributing to Firemitt

Thank you for your interest in contributing to **Firemitt**! We appreciate your help in making the project better.

Before you start contributing, please take a moment to review this guide, which outlines the process for contributing and the community guidelines we follow.

## Code of Conduct

We have a [Code of Conduct](CODE_OF_CONDUCT.md) that we expect all contributors to adhere to. Please read it and make sure you understand and follow it in all your interactions within our project.

## Getting Started

- If you are new to our project, please review our [README](README.md) for an overview of the project and how to get started.

- Check our [Issues](https://github.com/eoussama/firemitt/issues) to find tasks that need assistance or to report any bugs or feature requests.

## Requirements

- Node.js 24 or later.
- [pnpm](https://pnpm.io), the version pinned in the `packageManager` field of `package.json` (`corepack enable` picks it up).

## How to Contribute

1. Fork the repository to your GitHub account.

2. Create a new branch for your contribution:

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Make your changes. Useful scripts:

   | Script | Description |
   | ------ | ----------- |
   | `pnpm lint` / `pnpm lint:fix` | Lint (and fix) the code base. |
   | `pnpm build` | Type-check and build the library into `dist`. |
   | `pnpm test` | Run the unit tests. |
   | `pnpm coverage` | Run the unit tests with coverage, 100% coverage is enforced. |
   | `pnpm mutation` | Run the mutation tests ([Stryker](https://stryker-mutator.io)), the report is written to `reports/mutation`. A mutation score below 90% fails. |
   | `pnpm doc` | Generate the API documentation into `doc`. |
   | `pnpm playground` | Start the interactive playground against a Fireguard instance. |
   | `pnpm check` | Run everything: audit, lint, build, coverage, mutation tests and docs, as the CI does. |

5. Add or update tests and documentation (README and TSDoc comments) for your changes, and make sure `pnpm check` passes.

6. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org) (e.g. `fix: ...`, `feat: ...`, `docs: ...`), then push your branch to your fork.

7. Open a pull request against the `develop` branch, describing your changes and referencing the related issues.

## Compatibility

Firemitt talks to deployed Fireguard instances that may run older versions. Changes to the message protocol (`EventType`, `ErrorType`, message encoding) must stay backward compatible: never renumber or remove enum members, only append new ones.
