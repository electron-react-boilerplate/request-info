# require-bug-details

> A GitHub App built with [Probot](https://github.com/probot/probot) that A GitHub App built with probot that automatically closes issues that do not follow the issue template of a GitHub project

## Usage

1. Install the bot on the intended repositories. The plugin requires the following **Permissions and Events**:
- Pull requests: **Read & Write**
  - [x] check the box for **Pull Request** events
- Issues: **Read & Write**
  - [x] check the box for **Issue** events
2. Add a `.github/config.yml` file that contains the following:

```yml
# The comment the bot will make in the repo before
# closing the issue
requestInfoReplyComment: The maintainers of this repository require that you fill out the issue template correctly. # Default

# Only close issues that have the label 'bug'
requireBugLabel: true # Default

# If any one of these titles is not included, the issue will automatically be closed
requiredHeaders:
  - Prerequisites
  - Expected Behavior
  - Current Behavior
  - Possible Solution
  - Your Environment
```

## Local Setup

```sh
# Install dependencies
yarn

# Run the bot
yarn start
```

## Contributing

If you have suggestions for how require-bug-details could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2018-present Electron React Boilerplate
