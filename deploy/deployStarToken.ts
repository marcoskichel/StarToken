import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';

const deployStarToken: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  // the following will only deploy  if the contract was never deployed
  // or if the code changed since last deployment
  await deploy('StarToken', {
    from: deployer,
    args: [deployer, parseEther('100')]
  });
}

export default deployStarToken;
