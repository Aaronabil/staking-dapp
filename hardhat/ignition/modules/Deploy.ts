import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StakingModule = buildModule("StakingModule", (m) => {

    const stakeToken = m.contract("StakeToken");
    const rewardToken = m.contract("RewardToken");

    const staking = m.contract("Staking", [
        stakeToken,
        rewardToken,
    ]);

    return { stakeToken, rewardToken, staking };
});

export default StakingModule;