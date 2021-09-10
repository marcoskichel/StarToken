// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * Implementation of the Star Token, a ERC20 token which is generated during crowdfundings
 **/
contract StarToken is ERC20, Ownable {
  constructor(uint256 initialSupply) ERC20('StarToken', 'STAR') {
    // Mint the initialSupply and add it to the deployer wallet
    _mint(owner(), initialSupply);
  }

  /**
   * Mint a reward and give it to the investor, only the contract owner is allowed to invoke.
   * @param investorAddress The investor wallet address
   * @param investedAmount The value of the funds raised by the investor
   * @param proposalScore The student proposal score
   **/
  function mintInvestorReward(
    address investorAddress,
    uint256 investedAmount,
    uint256 proposalScore
  ) public onlyOwner {
    uint256 rewardedAmount = (investedAmount * proposalScore) / totalSupply();
    _mint(investorAddress, rewardedAmount);
  }
}
