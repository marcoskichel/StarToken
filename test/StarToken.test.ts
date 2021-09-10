import { expect, use } from 'chai';
import { StarToken } from '../typechain';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

use(waffle.solidity);

const initialSupply = 1000;

describe('StarToken', () => {
  let starToken: StarToken;
  let signers: SignerWithAddress[];
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    deployer = signers[0];
    const factory = await ethers.getContractFactory(
      'StarToken',
      deployer
    );
    starToken = <StarToken>await factory.deploy(initialSupply, []);
    await starToken.deployed();
  });

  describe('deploy', () => {
    it('should mint the initial supply', async () => {
      expect(await starToken.totalSupply()).to.equal(initialSupply);
    });

    it('should assign the initial supply to the deployer wallet', async () => {
      const deployerAddress = await deployer.getAddress();
      const deployerBalance = await starToken.balanceOf(deployerAddress);
      const totalSupply = await starToken.totalSupply();
      expect(deployerBalance).to.equal(totalSupply);
    });
  });

  describe('mintInvestorReward', () => {
    it('should allow owner invocations', async () => {
      const ownerAddress = await deployer.getAddress();
      await starToken.mintInvestorReward(ownerAddress, 2000, 2)
    });

    it('should not allow anyone else invocations', async () => {
      const signerAddress = await signers[1].getAddress()
      expect(starToken.mintInvestorReward(signerAddress, 2000, 2))
        .to.be.revertedWith('Only the contract owner can invoke this function.');
    });

    it('should generate the correct amount of tokens', async () => {
      // TODO: Once the formula is defined, implement this
    });
  });
});