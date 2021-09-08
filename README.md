# StarToken

Student crowdsourcing platform consisting of a [Solidity](https://docs.soliditylang.org/en/v0.8.7/) second-generation
blockchain DApp developed using the [HardHat](https://hardhat.org/) framework and a [ReactJS](https://reactjs.org/) web
frontend.

The frontend application lives under the `frontend` folder, while the DApp files are in the project's root.

# Requirements

- [Node](https://nodejs.org/en/): version 14.17.0.

# Setup

- Install the application dependencies

```bash
  npm install
```

- Compile the DApp files

```bash
  npm run compile
```

# Development

### Running tests

Test for the DApp use [ChaiJS](https://www.chaijs.com/) with [Waffle](https://getwaffle.io/).

To run them use the following command:
```bash
  npm run tests
```