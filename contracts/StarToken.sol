pragma solidity ^0.5.8;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

/**
* Implementation of the Star Token, a ERC777 token which is generated during crowdfundings
**/
contract StarToken is ERC777 {

  constructor(
    uint256 initialSupply
  ) public ERC777("StarToken", "STAR", new address[]) {
    // Mint the initialSupply and add it to the deployer wallet
    _mint(msg.sender, msg.sender, initialSupply, "", "");
  }

}