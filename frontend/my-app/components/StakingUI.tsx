'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { stakeTokenAddress, stakeTokenAbi, stakingAddress, stakingAbi, rewardTokenAddress } from '../lib/contracts';

export function StakingUI() {
    const { address, isConnected } = useAccount();
    const [stakeAmount, setStakeAmount] = useState('');

    const { data: stakeTokenBalance, refetch: refetchStakeTokenBalance } = useBalance({
        address: address,
        token: stakeTokenAddress,
        query: {
            enabled: isConnected,
        },
    });

    const { data: stakedInfo, refetch: refetchStakedAmount } = useReadContract({
        address: stakingAddress,
        abi: stakingAbi,
        functionName: 'userInfo',
        args: [address!],
        query: {
            enabled: isConnected,
        },
    });

    const { data: pendingReward, refetch: refetchPendingReward } = useReadContract({
        address: stakingAddress,
        abi: stakingAbi,
        functionName: 'pendingReward',
        args: [address!],
        query: {
            enabled: isConnected,
        },
    });

    const { data: approveHash, isPending: isApproving, writeContractAsync: approveAsync } = useWriteContract();
    const { data: stakeHash, isPending: isStaking, writeContractAsync: stakeAsync } = useWriteContract();
    const { data: unstakeHash, isPending: isUnstaking, writeContractAsync: unstakeAsync } = useWriteContract();
    const { data: claimHash, isPending: isClaiming, writeContractAsync: claimAsync } = useWriteContract();

    const { isLoading: isConfirmingApprove } = useWaitForTransactionReceipt({ hash: approveHash });
    const { isLoading: isConfirmingStake, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({ hash: stakeHash });
    const { isLoading: isConfirmingUnstake, isSuccess: isUnstakeSuccess } = useWaitForTransactionReceipt({ hash: unstakeHash });
    const { isLoading: isConfirmingClaim, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimHash });

    useEffect(() => {
        if (isStakeSuccess || isUnstakeSuccess || isClaimSuccess) {
            console.log('Transaksi berhasil, memuat ulang data...');
            refetchStakeTokenBalance();
            refetchStakedAmount();
            refetchPendingReward();
            setStakeAmount(''); // Kosongkan input field
        }
    }, [isStakeSuccess, isUnstakeSuccess, isClaimSuccess]);

    async function handleStake() {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
            alert("Masukkan jumlah yang valid");
            return;
        }

        try {
            const amountToStake = ethers.parseEther(stakeAmount);

            await approveAsync({
                address: stakeTokenAddress,
                abi: stakeTokenAbi,
                functionName: 'approve',
                args: [stakingAddress, amountToStake],
            });

            alert("Approval berhasil! Sekarang konfirmasi transaksi Stake.");
            await stakeAsync({
                address: stakingAddress,
                abi: stakingAbi,
                functionName: 'stake',
                args: [amountToStake],
            });

        } catch (error) {
            console.error(error);
            alert("Terjadi error. Lihat console untuk detail.");
        }
    }

    async function handleUnstake() {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
            alert("Masukkan jumlah yang valid");
            return;
        }
        try {
            const amountToUnstake = ethers.parseEther(stakeAmount);
            await unstakeAsync({
                address: stakingAddress,
                abi: stakingAbi,
                functionName: 'unstake',
                args: [amountToUnstake],
            });
        } catch (error) {
            console.error(error);
            alert("Terjadi error. Lihat console untuk detail.");
        }
    }

    async function handleClaimReward() {
        try {
            await claimAsync({
                address: stakingAddress,
                abi: stakingAbi,
                functionName: 'claimReward',
                args: [],
            });
        } catch (error) {
            console.error(error);
            alert("Terjadi error. Lihat console untuk detail.");
        }
    }

    if (!isConnected) {
        return (
            <div className="bg-slate-800 p-8 rounded-xl shadow-lg text-center w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Selamat Datang</h2>
                <p className="text-slate-400">Silakan hubungkan dompet Anda untuk memulai.</p>
            </div>
        );
    }

    const stakedAmountFormatted = stakedInfo ? stakedInfo[0] : BigInt(0);
    const pendingRewardFormatted = pendingReward || BigInt(0);

    const isInteracting = isApproving || isStaking || isUnstaking || isClaiming;

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Stake Your Tokens</h2>

            <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">Saldo STK Anda:</span>
                    <span className="font-bold">
                        {`${parseFloat(stakeTokenBalance?.formatted || '0').toFixed(2)} STK`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Jumlah Di-stake:</span>
                    <span className="font-bold">
                        {`${ethers.formatEther(stakedAmountFormatted)} STK`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Hadiah Anda:</span>
                    <span className="font-bold text-emerald-400">
                        {`${ethers.formatEther(pendingRewardFormatted)} RWD`}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="stakeAmount" className="block text-sm font-medium text-slate-300 mb-1">
                        Jumlah Stake / Unstake
                    </label>
                    <input
                        type="number"
                        id="stakeAmount"
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        placeholder="0.0"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        disabled={isInteracting}
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        className="flex-1 bg-sky-600 hover:bg-sky-700 rounded-md py-2 font-semibold transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                        onClick={handleStake}
                        disabled={isInteracting}
                    >
                        {isApproving ? 'Approving...' : isStaking ? 'Staking...' : 'Stake'}
                    </button>
                    <button
                        className="flex-1 bg-slate-600 hover:bg-slate-700 rounded-md py-2 font-semibold transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                        onClick={handleUnstake}
                        disabled={isInteracting}
                    >
                        {isUnstaking ? 'Unstaking...' : 'Unstake'}
                    </button>
                </div>
                <button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-md py-2 font-semibold transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                    onClick={handleClaimReward}
                    disabled={isInteracting}
                >
                    {isClaiming ? 'Claiming...' : 'Claim Reward'}
                </button>
            </div>
        </div>
    );
}