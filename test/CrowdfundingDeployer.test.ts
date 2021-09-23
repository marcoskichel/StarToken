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

  const deploy = async (address: string) => {
    return deployer.deployNewCrowdfunding(
      parseEther('2'),
      parseEther('1.5'),
      address,
      2
    );
  };

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    beneficiary = signers[1];
    existingBeneficiary = signers[2];
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
          beneficiaryAddress,
          2
        );
    });

    it('should not deploy if there is another one in progress for the account', async () => {
      await expect(
        deploy(await existingBeneficiary.getAddress())
      ).to.be.revertedWith('Already in progress instance.');
    });
  });
});