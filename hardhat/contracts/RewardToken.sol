// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev An ERC20 token that will be given as a reward for staking.
 * The owner of the contract can mint new tokens.
 */
contract RewardToken is ERC20, Ownable {
    constructor() ERC20("Reward Token", "RWD") Ownable(msg.sender) {}

    /**
     * @dev Creates `amount` tokens and assigns them to `account`.
     * Only the owner of the contract can call this function.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}