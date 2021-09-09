// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
* Implementation of the Star Token, a ERC20 token which is generated during crowdfundings
**/
contract StarToken is ERC20 {

  constructor(
    uint256 initialSupply
  ) ERC20("StarToken", "STAR") {
    // Mint the initialSupply and add it to the deployer wallet
    _mint(msg.sender, initialSupply);
  }

}