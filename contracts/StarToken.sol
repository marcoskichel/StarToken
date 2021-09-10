// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import 'hardhat/console.sol';

/**
 * Implementation of the Star Token, a ERC20 token which is generated during crowdfundings
 **/
contract StarToken is ERC20 {
  address private owner;

  constructor(uint256 initialSupply) ERC20('StarToken', 'STAR') {
    // Mint the initialSupply and add it to the deployer wallet
    owner = msg.sender;
    _mint(owner, initialSupply);
  }

  /**
   * Mint a reward and give it to the investor, only the contract owner is allowed to invoke.
   * @param investorWallet The investor wallet address
   * @param raisedFundsValue The value of the funds raised by the investor
   * @param proposalScore The student proposal score
   **/
  function mintInvestorReward(
    address investorWallet,
    uint256 raisedFundsValue,
    uint256 proposalScore
  ) public {
    require(
      msg.sender == owner,
      'Only the contract owner can invoke this function.'
    );
    uint256 rewardedAmount = (raisedFundsValue * proposalScore) / totalSupply();
    console.log('Rewarded amount is: ', rewardedAmount);
    _mint(investorWallet, rewardedAmount);
  }
}
