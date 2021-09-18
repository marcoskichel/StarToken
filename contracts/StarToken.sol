// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * Implementation of the Star Token, a ERC20 token which is generated during crowdfundings
 **/
contract StarToken is ERC20, Ownable {
  constructor(uint256 initialSupply) public ERC20('StarToken', 'STAR') {
    // Mint the initialSupply and add it to the deployer wallet
    _mint(owner(), initialSupply);
  }

  /**
   * Mint a given amount of tokens and add it to the given account.
   * @param account The destination account address
   * @param rewardedAmount The invested amount
   **/
  function mint(address payable account, uint256 rewardedAmount)
    public
    onlyOwner
  {
    _mint(account, rewardedAmount);
  }
}
