import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';

const deployCrowdfundingDeployer: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {
  const { deploy, get } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const starToken = await get('StarToken');

  // the following will only deploy  if the contract was never deployed
  // or if the code changed since last deployment
  await deploy('CrowdfundingDeployer', {
    from: deployer,
    args: [starToken.address]
  });
}

deployCrowdfundingDeployer.runAtTheEnd = true;

export default deployCrowdfundingDeployer;
