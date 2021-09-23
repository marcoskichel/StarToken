import { expect, use } from 'chai';
import { CrowdfundingDeployer, StarToken } from '../typechain';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther } from 'ethers/lib/utils';

use(waffle.solidity);

describe('CrowdfundingDeployer', () => {
  let deployer: CrowdfundingDeployer;
  let starToken: StarToken;
  let signers: SignerWithAddress[];
  let owner: SignerWithAddress;
  let beneficiary: SignerWithAddress;
  let existingBeneficiary: SignerWithAddress;
  let devTeam: SignerWithAddress;

  const deploy = async (address: string) => {
    return deployer.deployNewCrowdfunding(
      parseEther('2'),
      parseEther('1.5'),
      address,
      2,
      await devTeam.getAddress()
    );
  };

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    beneficiary = signers[1];
    existingBeneficiary = signers[2];
    devTeam = signers[3];
    const starTokenFactory = await ethers.getContractFactory(
      'StarToken',
      owner
    );
    const deployerFactory = await ethers.getContractFactory(
      'CrowdfundingDeployer',
      owner
    );
    starToken = <StarToken>await starTokenFactory
      .deploy(await owner.getAddress(), parseEther('10'));
    await starToken.deployed();
    deployer = <CrowdfundingDeployer>await deployerFactory.deploy(starToken.address);
    await deployer.deployed();
    await deploy(await existingBeneficiary.getAddress());
  });

  describe('deployNewCrowdfundingInstance', () => {
    it('should deploy new instances', async () => {
      const beneficiaryAddress = await beneficiary.getAddress();
      await expect(deploy(beneficiaryAddress))
        .to.emit(deployer, 'CrowdfundingDeployed')
        .withArgs(
          parseEther('2'),
          parseEther('1.5'),
          starToken.address,
          beneficiaryAddress,
          2,
          await devTeam.getAddress()
        );
    });

    it('should not deploy if there is another one in progress for the account', async () => {
      await expect(
        deploy(await existingBeneficiary.getAddress())
      ).to.be.revertedWith('Already in progress instance.');
    });
  });
});