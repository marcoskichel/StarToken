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
    starToken = <StarToken>await starTokenFactory
      .deploy(await owner.getAddress(), parseEther('10'));
    await starToken.deployed();
    const beneficiaryAddress = await beneficiary.getAddress();
    crowdfunding = <Crowdfunding>await crowdfundingFactory
      .deploy(parseEther('2'), parseEther('1.5'), starToken.address, beneficiaryAddress, 2);
    await crowdfunding.deployed();
    await starToken.grantRole(await starToken.MINTER_ROLE(), crowdfunding.address);
    await starToken.grantRole(await starToken.BURNER_ROLE(), crowdfunding.address);
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
      expect(await crowdfunding.status()).to.eq(0);
    });

    it('should finalize instance if investment reaches objective', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      expect(await crowdfunding.status()).to.eq(1);
    });

    it('should emit Finalized event if investment reaches objective', async () => {
      const [investor] = investors;
      await expect(crowdfunding.connect(investor).invest({ value: parseEther('2') }))
        .to.emit(crowdfunding, 'Finalized')
        .withArgs(await beneficiary.getAddress(), 1);
    });
  });

  describe('finalize', () => {
    it('should finalized as successful if investment is equal the min objective', async () => {
      await crowdfunding.invest({ value: parseEther('1.5') })
      await crowdfunding.finalize();
      expect(await crowdfunding.status()).to.eq(1);
    });

    it('should finalized as successful if investment is higher than the min objective', async () => {
      await crowdfunding.invest({ value: parseEther('3') })
      await crowdfunding.finalize();
      expect(await crowdfunding.status()).to.eq(1);
    });

    it('should emit Finalized event', async () => {
      await crowdfunding.finalize();
      await expect(crowdfunding.finalize()).to.emit(crowdfunding, 'Finalized');
    });

    it('should allow only the contract owner to invoke', async () => {
      const [investor] = investors;
      await crowdfunding.finalize();
      await expect(crowdfunding.connect(investor).finalize())
        .to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('claimReward', () => {
    it('should claim existing rewards', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      await crowdfunding.connect(investor).claimReward();
      const investorBalance = await starToken.balanceOf(await investor.getAddress());
      expect(investorBalance).to.eq(parseEther('1'));
    });

    it('should revert if no reward is available to the address', async () => {
      const [investor, noRewardInvestor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      await expect(crowdfunding.connect(noRewardInvestor).claimReward())
        .to.be.revertedWith('No reward available for this address.');
    });

    it('should revert if crowdfunding still in progress', async () => {
      const [investor] = investors;
      await expect(crowdfunding.connect(investor).claimReward())
        .to.be.revertedWith('No rewards available.');
    });

    it('should revert if crowdfunding has failed', async () => {
      const [investor] = investors;
      await crowdfunding.connect(owner).finalize();
      await expect(crowdfunding.connect(investor).claimReward())
        .to.be.revertedWith('No rewards available.');
    });

    it('should emit InvestmentRewarded event on success', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      await expect(crowdfunding.connect(investor).claimReward())
        .to.emit(crowdfunding, 'InvestmentRewarded')
        .withArgs(await investor.getAddress(), parseEther('1'));
    });
  });

  describe('refund', () => {
    it('should refund investments', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      await crowdfunding.connect(owner).finalize();
      await crowdfunding.connect(investor).refund();
      const investorBalance = await investor.getBalance();
      expect(investorBalance).to.gte(parseEther('0.99'));
    });

    it('should revert if address has no invested value', async () => {
      const [investor, notInvestor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      await crowdfunding.connect(owner).finalize();
      await expect(crowdfunding.connect(notInvestor).refund())
        .to.be.revertedWith('No investments found for this address.');
    });

    it('should revert if crowdfunding still in progress', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      await expect(crowdfunding.connect(investor).refund())
        .to.be.revertedWith('Unable to refund.');
    });

    it('should revert if crowdfunding has succeeded', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      await expect(crowdfunding.connect(investor).refund())
        .to.be.revertedWith('Unable to refund.');
    });

    it('should emit InvestmentRefunded event on success', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      await crowdfunding.connect(owner).finalize();
      await expect(crowdfunding.connect(investor).refund())
        .to.emit(crowdfunding, 'InvestmentRefunded')
        .withArgs(await investor.getAddress(), parseEther('1'));
    });
  });

  describe('withdraw', () => {
    it('should withdraw investments', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      await crowdfunding.connect(beneficiary).withdraw();
      expect(await beneficiary.getBalance()).to.gte(parseEther('1.99'));
    });

    it('should revert if withdraw has already been executed', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      await crowdfunding.connect(beneficiary).withdraw();
      await expect(crowdfunding.connect(beneficiary).withdraw())
        .to.be.revertedWith('Already withdrawn.');
    });

    it('should revert if crowdfunding still in progress', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      await expect(crowdfunding.connect(beneficiary).withdraw())
        .to.be.revertedWith('Unable to withdraw.');
    });

    it('should revert if crowdfunding has failed', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('1') });
      await crowdfunding.connect(owner).finalize();
      await expect(crowdfunding.connect(beneficiary).withdraw())
        .to.be.revertedWith('Unable to withdraw.');
    });

    it('should emit InvestmentWithdrawn event on success', async () => {
      const [investor] = investors;
      await crowdfunding.connect(investor).invest({ value: parseEther('2') });
      await expect(crowdfunding.connect(beneficiary).withdraw())
        .to.emit(crowdfunding, 'InvestmentWithdrawn')
        .withArgs(await beneficiary.getAddress(), parseEther('2'));
    });
  });
});