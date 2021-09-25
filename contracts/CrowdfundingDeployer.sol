// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './StarToken.sol';
import './Crowdfunding.sol';

/**
 * @dev Handles deploying new instances of the crowdfunding contract
 */
contract CrowdfundingDeployer is Ownable, ReentrancyGuard {
  using Address for address payable;

  /** @dev The contract token */
  StarToken private immutable token;

  /** @dev The deployed instances of the crowdfunding token */
  mapping(address => address[]) public instances;

  constructor(StarToken _token) {
    token = _token;
  }

  function validateCrowdfundingDeploy(address payable _beneficiary)
    private
    view
  {
    address[] memory currentInstances = instances[_beneficiary];
    if (currentInstances.length > 0) {
      Crowdfunding lastActive = Crowdfunding(
        currentInstances[currentInstances.length - 1]
      );
      require(
        lastActive.status() != Crowdfunding.CrowdfundingStatus.IN_PROGRESS,
        'Already in progress instance.'
      );
    }
  }

  /**
   * @dev Event representing a deployed crowdfunding instance
   * @param weiObjective The objective of the crowdfunding in wei
   * @param weiMinObjective The minimum objective of the crowdfunding in wei
   * @param token The contract token
   * @param beneficiary The crowdfunding beneficiary wallet address
   * @param weiTokenPrice The token price of a Star Token in wei for the deployed contract
   * @param devTeamWallet The development team wallet address
   */
  event CrowdfundingDeployed(
    uint256 weiObjective,
    uint256 weiMinObjective,
    StarToken token,
    address payable beneficiary,
    uint256 weiTokenPrice,
    address payable devTeamWallet
  );

  /**
   * @dev Deploy a new crowdfunding instance
   * @param weiObjective The objective of the crowdfunding in wei
   * @param weiMinObjective The minimum objective of the crowdfunding in wei
   * @param beneficiary The crowdfunding beneficiary wallet address
   * @param weiTokenPrice The token price of a Star Token in wei for the deployed contract
   * @param devTeamWallet The development team wallet address
   */
  function deployNewCrowdfunding(
    uint256 weiObjective,
    uint256 weiMinObjective,
    address payable beneficiary,
    uint256 weiTokenPrice,
    address payable devTeamWallet
  ) public onlyOwner nonReentrant {
    validateCrowdfundingDeploy(beneficiary);
    Crowdfunding instance = new Crowdfunding(
      weiObjective,
      weiMinObjective,
      token,
      beneficiary,
      weiTokenPrice,
      devTeamWallet
    );
    instances[beneficiary].push(address(instance));
    emit CrowdfundingDeployed(
      weiObjective,
      weiMinObjective,
      token,
      beneficiary,
      weiTokenPrice,
      devTeamWallet
    );
  }
}
