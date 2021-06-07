<br />
<p align="center">
  <h3 align="center">Ethhole Santas List dApp</h3>

  <p align="center">
    A user tracking dapp. Build a system for tracking who is on their nice list and who is on their naughty list. Allow for people to pay a fee to get themselves off of the naughty list. Let users on the nice list earn a portion of the fees based on how many other people are on the nice list. There is some built in ponzinomics.
  </p>
  <p>Additional Rules:</p>
  <ul>
    <li>The list owner is not allowed to join any list.</li>
    <li>Once you are added onto the nice list, the list owner cannot move you to the naughty list.</li>
    <li>You can only join the nice list by moving over from the naughty list by paying a fee.</li>
    <li>The owner of the list is not allowed to add individuals to the nice list.</li>
    <li>Similarly, you can only be added to the naughty list by the owner.</li>
    <li>The list owner is not allowed to move you from the naughty list to the nice list.</li>
    <li>The withdrawable amount changes over time based on the number of people on the nice list and the contract balance.</li>
  </ul>
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
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Built With

- [Solidity](https://soliditylang.org/)
- [Hardhat](https://hardhat.org/)
- [TypeScript](https://typescriptlang.org/)
- [The Graph](https://thegraph.com/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/0xdavinchee/ethhole-santa-list.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env` file and add the two following values:

- `INFURA_API_KEY`: You can get this from https://infura.io by signing up for a free account.
- `RINKEBY_PRIVATE_KEY` (if you want to deploy to testnet).

<!-- USAGE EXAMPLES -->

## Usage

To compile: `npx hardhat compile`.

To run tests: `npx hardhat test`.

Run `npx hardhat node` to start up a local node.

Open up another terminal window and run `npx hardhat deploy --network localhost` to deploy your project to localhost. You can similarly deploy to other networks like so: `npx hardhat deploy --network <NETWORK>`

To set up the graph you need to initialize a graph project, you can follow follow the instructions here: https://medium.com/blockrocket/dapp-development-with-a-local-subgraph-ganache-setup-566a4d4cbb.

I currently first verify my contract on rinkeby and then use `graph init` to initialize the project using the deployed project so that the graph initializes the project with the correct ABI and some boilerplate code.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

[@0xdavinchee](https://twitter.com/@0xdavinchee) - 0xdavinchee@gmail.com

Project Link: [https://github.com/0xdavinchee/ethhole-santa-list](https://github.com/0xdavinchee/ethhole-santa-list)
