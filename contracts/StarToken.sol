pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract StarToken is ERC777 {

  constructor(
    uint256 initialSupply
  ) ERC777("StarToken", "STAR", new address[]) public {
    _mint(msg.sender, msg.sender, initialSupply, "", "");
  }

}