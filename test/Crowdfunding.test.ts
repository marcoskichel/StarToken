import { expect, use } from 'chai';
import { Crowdfunding, StarToken } from '../typechain';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther } from 'ethers/lib/utils';

use(waffle.solidity);

describe('Crowdfunding', () => {
  let crowdfunding: Crowdfunding;
  let starToken: StarToken;
  let signers: SignerWithAddress[];
  let owner: SignerWithAddress;
  let beneficiary: SignerWithAddress;
  let investors: SignerWithAddress[];

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    beneficiary = signers[1];
    investors = [signers[2], signers[3]];
    const starTokenFactory = await ethers.getContractFactory(
      'StarToken',
      owner
    );
    const crowdfundingFactory = await ethers.getContractFactory(
      'Crowdfunding',
      owner
    );
    starToken = <StarToken>await starTokenFactory.deploy(5000, []);
    await starToken.deployed();
    const beneficiaryAddress = await beneficiary.getAddress();
    crowdfunding = <Crowdfunding>await crowdfundingFactory
      .deploy(parseEther('2'), starToken.address, beneficiaryAddress, 100);
    await crowdfunding.deployed();
  });

  describe('invest', () => {
    it('should record total invested wei', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      const totalInvestedWei = await crowdfunding.totalInvestedWei();
      expect(totalInvestedWei).to.eq(parseEther('1'));
    });

    it('should not allow investments on finalized instances', async () => {
      const [investor] = investors;
      await crowdfunding.connect(owner).finalize();
      await expect(crowdfunding.connect(investor).invest({ value: parseEther('1') }))
        .to.be.revertedWith('Crowdfunding is finalized.');
    });

    it('should emit success event', async () => {
      const [investor] = investors;
      await expect(crowdfunding.connect(investor).invest({ value: parseEther('1') }))
        .to.emit(crowdfunding, 'Invested')
        .withArgs(await investor.getAddress(), parseEther('1'));
    });

    it('should keep instance unfinalized if investment does not reach objective', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      expect(await crowdfunding.isFinalized()).to.eq(false)
    });

    it('should finalize instance if investment reaches objective', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      expect(await crowdfunding.isFinalized()).to.eq(true)
    });
  });
});