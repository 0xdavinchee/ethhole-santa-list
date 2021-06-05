import { HardhatUserConfig } from "hardhat/config";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-prettier";
import "hardhat-typechain";
import "solidity-coverage";

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
};

export default config;
