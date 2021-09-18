// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './MintableERC20.sol';

contract Crowdfunding is Ownable, ReentrancyGuard {
  using Address for address payable;

  /** @dev The amount of decimals in one ether */
  uint256 public constant ETHER_IN_WEI = 1000000000000000000;

  /** @dev The target token of this crowdfunding */
  MintableERC20 private immutable token;

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

  /** @dev Whether this crowdfunding is finalized */
  bool public isFinalized;

  constructor(
    uint256 _etherInvestmentObjective,
    MintableERC20 _token,
    address payable _beneficiary,
    uint256 _weiTokenPrice
  ) {
    require(_etherInvestmentObjective > 0, 'Objective should be a positive.');
    require(_weiTokenPrice > 0, 'Token price should be positive.');

    token = _token;
    beneficiary = _beneficiary;
    weiObjective = _etherInvestmentObjective * ETHER_IN_WEI;
    isFinalized = false;
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
    require(isFinalized, 'Crowdfund still in progress.');

    address payable investorWallet = payable(msg.sender);
    uint256 investment = investments[investorWallet];
    uint256 reward = calculateReward(investment);

    token.mint(investorWallet, reward);
    emit InvestmentRewarded(investorWallet, reward);
  }

  /**
   * @dev Invest an amount of wei into this crowdfunding instance
   */
  function invest() public payable nonReentrant {
    require(!isFinalized, 'Crowdfunding is finalized.');

    address payable investorWallet = payable(msg.sender);
    uint256 investmentWeiValue = msg.value;

    require(investmentWeiValue > 0, 'Investments should be positive.');

    investments[investorWallet] += investmentWeiValue;
    totalInvestedWei += investmentWeiValue;

    if (investmentWeiValue >= weiObjective) {
      finalize();
    }
  }

  function validateLeafOperation() private view {
    require(isFinalized, 'Crowdfunding still in progress.');
    require(totalInvestedWei > 0, 'Already withdrawn.');
  }

  event Withdrawn(address indexed _address, uint256 weiAmount);

  function withdraw() public nonReentrant {
    validateLeafOperation();

    totalInvestedWei = 0;
    beneficiary.sendValue(totalInvestedWei);

    emit Withdrawn(beneficiary, totalInvestedWei);
  }

  event Finalized(address indexed _beneficiary);

  function finalize() public onlyOwner {
    isFinalized = true;
    emit Finalized(beneficiary);
  }

  event Refunded(address indexed _wallet, uint256 weiAmount);

  function refund() public nonReentrant {
    validateLeafOperation();

    address payable wallet = payable(msg.sender);
    uint256 value = investments[wallet];

    totalInvestedWei -= value;
    wallet.sendValue(value);

    emit Refunded(wallet, value);
  }
}
