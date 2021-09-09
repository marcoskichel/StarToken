// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
 * Implementation of the Star Token, a ERC20 token which is generated during crowdfundings
 **/
contract StarToken is ERC20 {
  constructor(uint256 initialSupply) ERC20('StarToken', 'STAR') {
    // Mint the initialSupply and add it to the deployer wallet
    _mint(msg.sender, initialSupply);
  }

  /**
   * Mint a reward and give it to the investor
   * @param investorWallet The investor wallet address
   * @param raisedFundsValue The value of the funds raised by the investor
   * @param proposalScore The student proposal score
   **/
  function mintInvestorReward(
    address investorWallet,
    uint256 raisedFundsValue,
    uint256 proposalScore
  ) public {
    uint256 rewardedAmount = (raisedFundsValue * proposalScore) / totalSupply();
    console.log('Rewarded amount is: ', rewardedAmount);
    _mint(investorWallet, rewardedAmount);
  }
}
