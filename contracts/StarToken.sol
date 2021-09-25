// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

/**
 * @title StarToken
 *
 * @dev Implementation of the Star Token, a ERC20 token which is minted as
 * reward for student crowdfundings.
 **/
contract StarToken is ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
  bytes32 public constant BURNER_ROLE = keccak256('BURNER_ROLE');

  constructor(address owner, uint256 initialSupply) ERC20('StarToken', 'STAR') {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _mint(owner, initialSupply);
  }

  /**
   * @dev An event that carry information about a token mintage
   * @param to The wallet to where the minted tokens was allocated
   * @param amount The amount of tokens minted
   */
  event Minted(address indexed to, uint256 amount);

  /**
   * @dev Mint coins and send it to a given wallet
   */
  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
    emit Minted(to, amount);
  }

  /**
   * @dev An event that carry information about a token burn
   * @param from The wallet from which the tokens were burn
   * @param amount The amount of tokens burn
   */
  event Burned(address indexed from, uint256 amount);

  /**
   * @dev Burn coins from a given wallet
   */
  function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
    _burn(from, amount);
    emit Burned(from, amount);
  }
}
