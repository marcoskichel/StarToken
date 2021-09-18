// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './MintableERC20.sol';

/**
 * @dev Implementation of the Star Token, a ERC20 token which is generated during crowdfundings
 **/
contract StarToken is Ownable, MintableERC20 {
  constructor(uint256 initialSupply) ERC20('StarToken', 'STAR') {
    // Mint the initialSupply and add it to the deployer wallet
    _mint(owner(), initialSupply);
  }

  /**
   * @dev Mint a given amount of tokens and add it to the given account.
   * @param account The destination account address
   * @param amount The invested amount
   **/
  function mint(address payable account, uint256 amount)
    public
    override
    onlyOwner
  {
    super.mint(account, amount);
  }
}
