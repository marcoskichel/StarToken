import { HardhatUserConfig } from "hardhat/config";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter"
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "solidity-coverage";

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
    coinmarketcap: '30817f21-955c-4cc0-827e-9ef11f3ae6b6',
    gasPrice: 6.478
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      4: '0xA296a3d5F026953e17F472B497eC29a5631FB51B', // but for rinkeby it will be a specific address
      "goerli": '0x84b9514E013710b9dD0811c9Fe46b837a4A0d8E0', //it can also specify a specific netwotk name (specified in hardhat.config.js)
    },
    feeCollector:{
      default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
      1: '0xa5610E1f289DbDe94F3428A9df22E8B518f65751', // on the mainnet the feeCollector could be a multi sig
      4: '0xa250ac77360d4e837a13628bC828a2aDf7BabfB3', // on rinkeby it could be another account
    }
  }
};

export default config;
