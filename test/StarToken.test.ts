import { expect, use } from 'chai';
import { StarToken } from '../typechain';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers';
import { parseEther } from 'ethers/lib/utils';

use(waffle.solidity);

const initialSupply = parseEther('10');

describe('StarToken', () => {
  let starToken: StarToken;
  let signers: SignerWithAddress[];
  let owner: SignerWithAddress;
  let minterRole: string;
  let burnerRole: string;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    const factory = await ethers.getContractFactory('StarToken', owner);
    starToken = <StarToken>(
      await factory.deploy(await owner.getAddress(), initialSupply)
    );
    await starToken.deployed();
    minterRole = await starToken.MINTER_ROLE();
    burnerRole = await starToken.BURNER_ROLE();
    await starToken.grantRole(minterRole, await owner.getAddress());
    await starToken.grantRole(burnerRole, await owner.getAddress());
  });

  describe('deploy', () => {
    it('should mint the initial supply', async () => {
      expect(await starToken.totalSupply()).to.equal(initialSupply);
    });

    it('should assign the initial supply to the owner wallet', async () => {
      const deployerAddress = await owner.getAddress();
      const deployerBalance = await starToken.balanceOf(deployerAddress);
      const totalSupply = await starToken.totalSupply();
      expect(deployerBalance).to.equal(totalSupply);
    });
  });

  describe('mint', () => {
    it('should mint tokens', async () => {
      const amount = parseEther('1');
      const ownerAddress = await owner.getAddress();
      await starToken.mint(ownerAddress, amount);
      expect(await starToken.totalSupply()).to.eq(initialSupply.add(amount));
    });

    it('should assign minted tokens to the correct wallet address', async () => {
      const ownerAddress = await owner.getAddress();
      const amount = parseEther('1');
      await starToken.mint(ownerAddress, amount);
      expect(await starToken.balanceOf(ownerAddress)).to.eq(
        initialSupply.add(amount)
      );
    });

    it('should emit Minted event on success', async () => {
      const ownerAddress = await owner.getAddress();
      const amount = parseEther('1');
      await expect(starToken.mint(ownerAddress, amount))
        .to.emit(starToken, 'Minted')
        .withArgs(ownerAddress, amount);
    });

    it('should not allow unauthorized addresses to mint tokens', async () => {
      const amount = parseEther('1');
      const unauthorized = await signers[1].getAddress();
      await expect(starToken.connect(signers[1]).mint(unauthorized, amount)).to
        .be.reverted;
    });
  });

  describe('burn', () => {
    it('should burn tokens', async () => {
      const amount = parseEther('1');
      const ownerAddress = await owner.getAddress();
      await starToken.burn(ownerAddress, amount);
      expect(await starToken.totalSupply()).to.eq(initialSupply.sub(amount));
    });

    it('should burn tokens from the correct wallet address', async () => {
      const amount = parseEther('1');
      const ownerAddress = await owner.getAddress();
      await starToken.burn(ownerAddress, amount);
      expect(await starToken.balanceOf(ownerAddress)).to.eq(
        initialSupply.sub(amount)
      );
    });

    it('should emit Burned event on success', async () => {
      const amount = parseEther('1');
      const ownerAddress = await owner.getAddress();
      await expect(starToken.burn(ownerAddress, amount))
        .to.emit(starToken, 'Burned')
        .withArgs(ownerAddress, amount);
    });

    it('should not allow unauthorized addresses invocations', async () => {
      const amount = parseEther('1');
      const unauthorized = await signers[1].getAddress();
      await expect(starToken.connect(signers[1]).burn(unauthorized, amount)).to
        .be.reverted;
    });
  });
});
