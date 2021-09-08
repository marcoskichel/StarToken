// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { ERC777 } from  "@openzeppelin/contracts/token/ERC777/ERC777.sol";

/**
* Implementation of the Star Token, a ERC777 token which is generated during crowdfundings
**/
contract StarToken is ERC777 {

  constructor(
    uint256 initialSupply,
    address[] memory defaultOperators
  ) ERC777("StarToken", "STAR", defaultOperators) {
    // Mint the initialSupply and add it to the deployer wallet
    _mint(msg.sender, initialSupply, "", "");
  }

}