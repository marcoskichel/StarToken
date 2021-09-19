// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './StarToken.sol';

contract Crowdfunding is Ownable, ReentrancyGuard {
  using Address for address payable;

  enum CrowdfundingStatus { IN_PROGRESS, SUCCESS, FAIL}

  /** @dev The target token of this crowdfunding */
  StarToken private immutable token;

  /** @dev The price of one token in wei **/
  uint256 public immutable weiTokenPrice;

  /** @dev The objective total wei of this crowdfunding instance */
  uint256 public immutable weiObjective;

  /** @dev The beneficiary wallet address */
  address payable public immutable beneficiary;

  /** @dev The total invested wei in this crowdfunding instance */
  uint256 public totalInvestedWei;

  /** @dev A dictionary binding the investor wallets with the respective invested value */
  mapping(address => uint256) private investments;

  /** @dev The current state of this crowdfunding */
  CrowdfundingStatus public status;

  constructor(
    uint256 _weiObjective,
    StarToken _token,
    address payable _beneficiary,
    uint256 _weiTokenPrice
  ) {
    require(_weiObjective > 0, 'Objective should be a positive.');
    require(_weiTokenPrice > 0, 'Token price should be positive.');

    token = _token;
    beneficiary = _beneficiary;
    weiObjective = _weiObjective;
    status = CrowdfundingStatus.IN_PROGRESS;
    weiTokenPrice = _weiTokenPrice;
  }

  /**
   * @dev Calculates the number of rewarded tokens
   */
  function calculateReward(uint256 _weiAmount) internal view returns (uint256) {
    return _weiAmount / weiTokenPrice;
  }

  /**
   * @dev An event that represents that a reward has been generated through an investment
   */
  event InvestmentRewarded(address indexed investorWallet, uint256 reward);

  /**
   * @dev Infer the value of a reward and mint it directly into the investor wallet
   */
  function claimReward() public nonReentrant {
    require(status == CrowdfundingStatus.SUCCESS, 'No rewards available.');

    address payable investorWallet = payable(msg.sender);
    uint256 investment = investments[investorWallet];

    require(investment > 0, 'No reward available for this address.');

    uint256 reward = calculateReward(investment);

    token.mint(investorWallet, reward);
    emit InvestmentRewarded(investorWallet, reward);
  }

  event Invested(address indexed wallet, uint256 value);

  /**
   * @dev Invest an amount of wei into this crowdfunding instance
   */
  function invest() public payable nonReentrant {
    require(status == CrowdfundingStatus.IN_PROGRESS, 'Crowdfunding is finalized.');

    address payable investorWallet = payable(msg.sender);
    uint256 weiValue = msg.value;

    require(weiValue > 0, 'Investments should be positive.');

    investments[investorWallet] += weiValue;
    totalInvestedWei += weiValue;

    emit Invested(investorWallet, weiValue);

    if (totalInvestedWei >= weiObjective) {
      _finalize();
    }
  }

  event InvestmentWithdrawn(address indexed _address, uint256 weiAmount);

  function withdraw() public nonReentrant {
    require(status == CrowdfundingStatus.SUCCESS, 'Unable to withdraw.');
    require(totalInvestedWei > 0, 'Already withdrawn.');

    beneficiary.sendValue(totalInvestedWei);
    emit InvestmentWithdrawn(beneficiary, totalInvestedWei);
    totalInvestedWei = 0;
  }

  event Finalized(address indexed _beneficiary, CrowdfundingStatus status);

  function finalize() public onlyOwner {
    _finalize();
  }

  function _finalize() private {
    status = totalInvestedWei >= weiObjective
      ? CrowdfundingStatus.SUCCESS
      : CrowdfundingStatus.FAIL;
    emit Finalized(beneficiary, status);
  }

  event InvestmentRefunded(address indexed _wallet, uint256 weiAmount);

  function refund() public nonReentrant {
    require(status == CrowdfundingStatus.FAIL, 'Unable to refund.');

    address payable wallet = payable(msg.sender);
    uint256 value = investments[wallet];

    require(investments[wallet] > 0, 'No investments found for this address.');

    totalInvestedWei -= value;
    wallet.sendValue(value);

    emit InvestmentRefunded(wallet, value);
  }
}
