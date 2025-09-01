// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Staking
 * @dev A contract for staking StakeToken to earn RewardToken.
 */
contract Staking is Ownable, ReentrancyGuard {
    IERC20 public immutable stakeToken;
    IERC20 public immutable rewardToken;

    // Info untuk setiap staker
    struct UserInfo {
        uint256 amount; // Jumlah token yang di-stake
        uint256 rewardDebt; // Untuk perhitungan reward yang sudah diklaim
    }

    // Mapping dari alamat staker ke info mereka
    mapping(address => UserInfo) public userInfo;

    // Total token yang sedang di-stake di kontrak ini
    uint256 public totalStaked;
    
    // Reward per detik (bisa diubah oleh owner)
    uint256 public rewardRate = 1 * 10**18; // Contoh: 1 RWD per detik
    
    // Variabel untuk perhitungan reward
    uint256 public accRewardPerShare;
    uint256 public lastRewardTime;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardRateChanged(uint256 newRate);

    constructor(address _stakeToken, address _rewardToken) Ownable(msg.sender) {
        stakeToken = IERC20(_stakeToken);
        rewardToken = IERC20(_rewardToken);
        lastRewardTime = block.timestamp;
    }

    /**
     * @dev Updates the accumulated rewards per share.
     * This should be called before any state changes that affect rewards.
     */
    function updatePool() public {
        if (totalStaked == 0) {
            lastRewardTime = block.timestamp;
            return;
        }
        uint256 timeElapsed = block.timestamp - lastRewardTime;
        if (timeElapsed > 0) {
            uint256 reward = timeElapsed * rewardRate;
            accRewardPerShare += (reward * 1e18) / totalStaked;
        }
        lastRewardTime = block.timestamp;
    }

    /**
     * @dev Calculates the pending rewards for a user.
     * @param _user The address of the user.
     * @return The amount of pending rewards.
     */
    function pendingReward(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 tempAccRewardPerShare = accRewardPerShare;
        
        if (totalStaked > 0) {
            uint256 timeElapsed = block.timestamp - lastRewardTime;
            uint256 reward = timeElapsed * rewardRate;
            tempAccRewardPerShare += (reward * 1e18) / totalStaked;
        }

        return ((user.amount * tempAccRewardPerShare) / 1e18) - user.rewardDebt;
    }

    /**
     * @dev Stakes `_amount` of StakeToken.
     * @param _amount The amount to stake.
     */
    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake 0");
        UserInfo storage user = userInfo[msg.sender];

        updatePool();
        
        // Jika user sudah punya reward, kirim dulu rewardnya
        if (user.amount > 0) {
            uint256 pending = ((user.amount * accRewardPerShare) / 1e18) - user.rewardDebt;
            if (pending > 0) {
                _safeRewardTransfer(msg.sender, pending);
                emit RewardClaimed(msg.sender, pending);
            }
        }

        // Transfer token dari user ke kontrak ini
        stakeToken.transferFrom(msg.sender, address(this), _amount);
        
        user.amount += _amount;
        totalStaked += _amount;
        user.rewardDebt = (user.amount * accRewardPerShare) / 1e18;
        
        emit Staked(msg.sender, _amount);
    }

    /**
     * @dev Unstakes `_amount` of StakeToken.
     * @param _amount The amount to unstake.
     */
    function unstake(uint256 _amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "Insufficient staked amount");
        require(_amount > 0, "Cannot unstake 0");

        updatePool();

        uint256 pending = ((user.amount * accRewardPerShare) / 1e18) - user.rewardDebt;
        if (pending > 0) {
            _safeRewardTransfer(msg.sender, pending);
            emit RewardClaimed(msg.sender, pending);
        }

        user.amount -= _amount;
        totalStaked -= _amount;
        user.rewardDebt = (user.amount * accRewardPerShare) / 1e18;

        stakeToken.transfer(msg.sender, _amount);
        
        emit Unstaked(msg.sender, _amount);
    }

    /**
     * @dev Claims pending rewards.
     */
    function claimReward() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        updatePool();
        
        uint256 pending = ((user.amount * accRewardPerShare) / 1e18) - user.rewardDebt;
        require(pending > 0, "No rewards to claim");

        _safeRewardTransfer(msg.sender, pending);
        user.rewardDebt = (user.amount * accRewardPerShare) / 1e18;

        emit RewardClaimed(msg.sender, pending);
    }

    /**
     * @dev Sets a new reward rate. Only callable by the owner.
     * @param _newRate The new reward rate per second.
     */
    function setRewardRate(uint256 _newRate) external onlyOwner {
        updatePool();
        rewardRate = _newRate;
        emit RewardRateChanged(_newRate);
    }

    /**
     * @dev Safely transfers reward tokens.
     */
    function _safeRewardTransfer(address _to, uint256 _amount) internal {
        uint256 rewardBal = rewardToken.balanceOf(address(this));
        if (_amount > rewardBal) {
            rewardToken.transfer(_to, rewardBal);
        } else {
            rewardToken.transfer(_to, _amount);
        }
    }
}