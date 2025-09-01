import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { StakeToken, RewardToken, Staking } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Staking Contract", function () {
    let owner: HardhatEthersSigner;
    let staker1: HardhatEthersSigner;
    let staker2: HardhatEthersSigner;

    let stakeToken: StakeToken;
    let rewardToken: RewardToken;
    let staking: Staking;

    const STAKE_TOKEN_MINT_AMOUNT = ethers.parseEther("1000");
    const REWARD_TOKEN_SUPPLY = ethers.parseEther("1000000");

    beforeEach(async function () {
        [owner, staker1, staker2] = await ethers.getSigners();

        const StakeTokenFactory = await ethers.getContractFactory("StakeToken");
        stakeToken = await StakeTokenFactory.deploy();
        const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
        rewardToken = await RewardTokenFactory.deploy();
        const StakingFactory = await ethers.getContractFactory("Staking");
        staking = await StakingFactory.deploy(
            await stakeToken.getAddress(),
            await rewardToken.getAddress()
        );

        await stakeToken.mint(staker1.address, STAKE_TOKEN_MINT_AMOUNT);
        await stakeToken.mint(staker2.address, STAKE_TOKEN_MINT_AMOUNT);
        await rewardToken.mint(await staking.getAddress(), REWARD_TOKEN_SUPPLY);
    });

    it("Should deploy all contracts and set addresses correctly", async function () {
        expect(await staking.stakeToken()).to.equal(await stakeToken.getAddress());
        expect(await staking.rewardToken()).to.equal(await rewardToken.getAddress());
    });

    it("Should allow a user to stake tokens", async function () {
        const stakeAmount = ethers.parseEther("100");
        await stakeToken.connect(staker1).approve(await staking.getAddress(), stakeAmount);
        await staking.connect(staker1).stake(stakeAmount);

        const userInfo = await staking.userInfo(staker1.address);
        expect(userInfo.amount).to.equal(stakeAmount);
        expect(await staking.totalStaked()).to.equal(stakeAmount);
        const expectedBalance = STAKE_TOKEN_MINT_AMOUNT - stakeAmount;
        expect(await stakeToken.balanceOf(staker1.address)).to.equal(expectedBalance);
    });

    it("Should calculate rewards correctly over time", async function () {
        const stakeAmount = ethers.parseEther("100");
        const delay = 60 * 60;

        await stakeToken.connect(staker1).approve(await staking.getAddress(), stakeAmount);
        await staking.connect(staker1).stake(stakeAmount);

        await time.increase(delay);

        const pendingReward = await staking.pendingReward(staker1.address);
        
        const rewardRate = await staking.rewardRate();
        const expectedRewardManual = rewardRate * BigInt(delay);

        expect(pendingReward).to.equal(expectedRewardManual);
    });

    it("Should allow users to unstake tokens", async function () {
        const stakeAmount = ethers.parseEther("100");
        await stakeToken.connect(staker1).approve(await staking.getAddress(), stakeAmount);
        await staking.connect(staker1).stake(stakeAmount);

        const initialBalance = await stakeToken.balanceOf(staker1.address);
        await staking.connect(staker1).unstake(stakeAmount);

        const userInfo = await staking.userInfo(staker1.address);
        expect(userInfo.amount).to.equal(0);
        expect(await staking.totalStaked()).to.equal(0);
        const finalBalance = await stakeToken.balanceOf(staker1.address);
        expect(finalBalance).to.equal(initialBalance + stakeAmount);
    });

    it("Seharusnya mengizinkan pengguna untuk mengklaim hadiah", async function () {
        const stakeAmount = ethers.parseEther("100");
        const delay = 60 * 60;
        await stakeToken.connect(staker2).approve(await staking.getAddress(), stakeAmount);
        await staking.connect(staker2).stake(stakeAmount);
        
        await time.increase(delay);
        
        const rewardRate = await staking.rewardRate();
        const expectedReward = rewardRate * BigInt(delay + 1);
        
        await expect(staking.connect(staker2).claimReward()).to.changeTokenBalance(
            rewardToken,
            staker2,
            expectedReward
        );
    });
});