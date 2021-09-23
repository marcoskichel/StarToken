// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './StarToken.sol';

/**
 * @dev Representation of a crowdfunding for a student proposal.
 *
 * This contract when deployed allow investors to fund a student proposal and get
 * rewarded with Star tokens.
 *
 * In case of the crowdfunding not reaching the minimum wei objetive it also handles
 * refunding the investors.
 */
contract Crowdfunding is AccessControl, ReentrancyGuard {
  using Address for address payable;

  bytes32 public constant FINALIZER_ROLE = keccak256('FINALIZER_ROLE');

  enum CrowdfundingStatus {
    IN_PROGRESS,
    SUCCESS,
    FAIL
  }

  /** @dev The target token of this crowdfunding */
  StarToken private immutable token;

  /** @dev The price of one token in wei **/
  uint256 public immutable weiTokenPrice;

  /** @dev The objective total wei of this crowdfunding instance */
  uint256 public immutable weiObjective;

  /** @dev The minimum objective total wei of this crowdfunding instance */
  uint256 public immutable weiMinObjective;

  /** @dev The beneficiary wallet address */
  address payable public immutable beneficiary;

  /** @dev The total invested wei in this crowdfunding instance */
  uint256 public totalInvestedWei;

  /** @dev A dictionary binding the investor wallets with the respective invested value */
  mapping(address => uint256) private investments;

  /** @dev The current state of this crowdfunding */
  CrowdfundingStatus public status;

  /** @dev The development team wallet address */
  address payable public immutable devTeamWallet;

  constructor(
    uint256 _weiObjective,
    uint256 _weiMinObjective,
    StarToken _token,
    address payable _beneficiary,
    uint256 _weiTokenPrice,
    address payable _devTeamWallet
  ) {
    require(_weiObjective > 0, 'Objective should be a positive.');
    require(_weiTokenPrice > 0, 'Token price should be positive.');

    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

    token = _token;
    beneficiary = _beneficiary;
    weiObjective = _weiObjective;
    weiMinObjective = _weiMinObjective;
    status = CrowdfundingStatus.IN_PROGRESS;
    weiTokenPrice = _weiTokenPrice;
    devTeamWallet = _devTeamWallet;
  }

  /**
   * @dev Calculates the number of rewarded tokens generated upon a investment of wei
   */
  function calculateReward(uint256 _weiAmount) internal view returns (uint256) {
    return _weiAmount / weiTokenPrice;
  }

  /**
   * @dev An event that represents that a reward has been generated through an investment
   */
  event InvestmentRewarded(address indexed investorWallet, uint256 reward);

  /**
   * @dev Mint the reward for previously made investments and send it to the wallet of the claimer
   */
  function claimReward() public nonReentrant {
    require(status == CrowdfundingStatus.SUCCESS, 'No rewards available.');

    address payable investorWallet = payable(msg.sender);
    uint256 investment = investments[investorWallet];

    require(investment > 0, 'No reward for address.');

    uint256 reward = calculateReward(investment);

    token.mint(investorWallet, reward);
    emit InvestmentRewarded(investorWallet, reward);
  }

  /**
   * @dev A event that carry information about a wei investment made in this contract
   * @param wallet The wallet of the investor
   * @param weiAmount The invested wei amount
   */
  event Invested(address indexed wallet, uint256 weiAmount);

  /**
   * @dev Invest an amount of wei into this crowdfunding instance
   */
  function invest() public payable nonReentrant {
    require(
      status == CrowdfundingStatus.IN_PROGRESS,
      'Crowdfunding is finalized.'
    );

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

  /**
   * @dev A event that carry information about wei withdraws made by the student
   * @param wallet The wallet of the contract beneficiary
   * @param weiAmount The amount of wei withdrawn
   */
  event InvestmentWithdrawn(address indexed wallet, uint256 weiAmount);

  /**
   * @dev Withdraw the wei investment of a successful crowdfunding instance to
   * the wallet of the beneficiary student
   */
  function withdraw() public nonReentrant {
    require(status == CrowdfundingStatus.SUCCESS, 'Unable to withdraw.');
    require(totalInvestedWei > 0, 'Already withdrawn.');

    beneficiary.sendValue(totalInvestedWei);
    emit InvestmentWithdrawn(beneficiary, totalInvestedWei);
    totalInvestedWei = 0;
  }

  /**
   * @dev A event that carry information about the finalization act of this instance
   * @param beneficiaryWallet The wallet of the contract beneficiary
   * @param status The inferred final status of the contract
   */
  event Finalized(address indexed beneficiaryWallet, CrowdfundingStatus status);

  /**
   * @dev Finalize this crowdfunding contract, inferring its final status and allowing for
   * withdraws, reward claims, and refundings
   */
  function finalize() public onlyRole(FINALIZER_ROLE) {
    _finalize();
  }

  /**
   * @dev A event that carry information about a reward minted for the contract owner wallet
   * @param wallet The wallet of the contract owner
   * @param amount The amount of tokens rewarded
   */
  event PlatformRewarded(address indexed wallet, uint256 amount);

  /**
   * @dev Mints a token reward to the development team wallet
   */
  function mintPlatformReward() private {
    uint256 amount = calculateReward(totalInvestedWei) / 20;
    token.mint(devTeamWallet, amount);
    emit PlatformRewarded(devTeamWallet, amount);
  }

  function _finalize() private {
    status = totalInvestedWei >= weiMinObjective
      ? CrowdfundingStatus.SUCCESS
      : CrowdfundingStatus.FAIL;
    emit Finalized(beneficiary, status);
    if (status == CrowdfundingStatus.SUCCESS) {
      mintPlatformReward();
    }
  }

  /**
   * @dev A event that carry information about a refunding made to a investor
   */
  event InvestmentRefunded(address indexed _wallet, uint256 weiAmount);

  /**
   * @dev Refunds all the wei invested by an investor to its wallet
   */
  function refund() public nonReentrant {
    require(status == CrowdfundingStatus.FAIL, 'Unable to refund.');

    address payable wallet = payable(msg.sender);
    uint256 value = investments[wallet];

    require(investments[wallet] > 0, 'No investments for address.');

    totalInvestedWei -= value;
    wallet.sendValue(value);

    emit InvestmentRefunded(wallet, value);
  }
}
