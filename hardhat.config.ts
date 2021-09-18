import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter"

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true
      }
    }
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: '30817f21-955c-4cc0-827e-9ef11f3ae6b6'
  }
};

export default config;
