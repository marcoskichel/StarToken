import { HardhatUserConfig } from 'hardhat/config';

import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: '0.8.0'
};

export default config;
