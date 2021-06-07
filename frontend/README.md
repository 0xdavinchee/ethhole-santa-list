<br />
<p align="center">
  <h3 align="center">Ethhole Santa List dApp Frontend</h3>

  <p align="center">
    The client side of the santa list dApp.
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Built With

- [TypeScript](https://typescriptlang.org/)
- [React](https://reactjs.org/)
- [MaterialUI](https://material-ui.com/)
- [Apollo GraphQL](https://apollographql.com)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

You need to use a browser which has MetaMask installed to use this app.

### Installation

1. Install NPM packages
   ```sh
   npm install
   ```
2. Start the project
   ```sh
   yarn start
   ```
3. Create a `.env` file and add the two following values:

- `REACT_APP_GRAPHQL_URI`: the URI obtained from either a local graph deployment or from your dashboard at https://thegraph.com
- `REACT_APP_CONTRACT_ADDRESS`: the address of your deployed voting contract

<!-- USAGE EXAMPLES -->

## Usage

After running `yarn start`, the client will start up in your default browser and you can use the app.
