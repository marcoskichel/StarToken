// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

abstract contract MintableERC20 is ERC20 {
  function mint(address payable account, uint256 amount) public virtual {
    _mint(account, amount);
  }
}
