import { expect, use } from 'chai';
import { StarToken } from '../typechain';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

use(waffle.solidity);

const initialSupply = 1000;

describe('StarToken', () => {
  let starToken: StarToken;
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    const factory = await ethers.getContractFactory(
      'StarToken',
      deployer
    );
    starToken = <StarToken>await factory.deploy(initialSupply, []);
    await starToken.deployed();
  });

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