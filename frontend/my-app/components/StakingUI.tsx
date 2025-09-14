'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { stakeTokenAddress, stakeTokenAbi, stakingAddress, stakingAbi } from '../lib/contracts';
import { GlowEffect } from './motion-primitives/glow-effect';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { RiCheckboxCircleFill, RiErrorWarningFill, RiCopperCoinLine } from '@remixicon/react';
import { motion, AnimatePresence } from 'framer-motion';

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

    const { isLoading: isConfirmingApprove, } = useWaitForTransactionReceipt({ hash: approveHash });
    const { isLoading: isConfirmingStake, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({ hash: stakeHash });
    const { isLoading: isConfirmingUnstake, isSuccess: isUnstakeSuccess } = useWaitForTransactionReceipt({ hash: unstakeHash });
    const { isLoading: isConfirmingClaim, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimHash });

    const refetchAllData = useCallback(() => {
        refetchStakeTokenBalance();
        refetchStakedAmount();
        refetchPendingReward();
    }, [refetchStakeTokenBalance, refetchStakedAmount, refetchPendingReward]);

    useEffect(() => {
        if (isStakeSuccess || isUnstakeSuccess || isClaimSuccess) {
            refetchAllData();
            setStakeAmount('');
            toast.custom((t) => (
                <AnimatePresence >
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Alert variant="success" appearance="outline" className="shadow-lg">
                                <AlertIcon><RiCheckboxCircleFill /></AlertIcon>
                                <AlertTitle>Transaction successfully confirmed!</AlertTitle>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            ));
        }
    }, [isStakeSuccess, isUnstakeSuccess, isClaimSuccess, refetchAllData]);

    async function handleStake() {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
            return toast.custom((t) => (
                <AnimatePresence >
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Alert variant="warning" appearance="outline" className="shadow-lg">
                                <AlertIcon><RiErrorWarningFill /></AlertIcon>
                                <AlertTitle>Enter a valid amount.</AlertTitle>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            ));
        } try {
            const amountToStake = ethers.parseEther(stakeAmount);
            await approveAsync({
                address: stakeTokenAddress,
                abi: stakeTokenAbi,
                functionName: 'approve',
                args: [stakingAddress, amountToStake],
            });
            toast.custom((t) => (
                <AnimatePresence >
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Alert variant="info" appearance="outline" className="shadow-lg">
                                <AlertIcon><RiCheckboxCircleFill /></AlertIcon>
                                <AlertTitle>Approval successful! Now confirm the Stake transaction.</AlertTitle>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            ));
            await stakeAsync({
                address: stakingAddress,
                abi: stakingAbi,
                functionName: 'stake',
                args: [amountToStake],
            });
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred.';
            toast.custom((t) => (
                <AnimatePresence >
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Alert variant="destructive" appearance="outline" className="shadow-lg">
                                <AlertIcon><RiErrorWarningFill /></AlertIcon>
                                <AlertTitle>{errorMessage.includes('User rejected') ? 'Transaction cancelled.' : 'An error occurred.'}</AlertTitle>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            ));
        }
    }

    async function handleUnstake() {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
            return toast.custom((t) => (
                <AnimatePresence>
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Alert variant="warning" appearance="outline" className="shadow-lg">
                                <AlertIcon><RiErrorWarningFill /></AlertIcon>
                                <AlertTitle>Enter a valid amount.</AlertTitle>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            ));
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
            const errorMessage = error instanceof Error ? error.message : 'An error occurred.';
            toast.custom((t) => (
                <AnimatePresence>
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Alert variant="destructive" appearance="outline" className="shadow-lg">
                                <AlertIcon><RiErrorWarningFill /></AlertIcon>
                                <AlertTitle>{errorMessage.includes('User rejected') ? 'Transaction cancelled.' : 'An error occurred.'}</AlertTitle>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            ));
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
            const errorMessage = error instanceof Error ? error.message : 'An error occurred.';
            toast.custom((t) => (
                <AnimatePresence>
                    {t.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                        >
                            <Alert variant="destructive" appearance="outline" className="shadow-lg">
                                <AlertIcon><RiErrorWarningFill /></AlertIcon>
                                <AlertTitle>{errorMessage.includes('User rejected') ? 'Transaction cancelled.' : 'An error occurred.'}</AlertTitle>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            ));
        }
    }

    if (!isConnected) {
        return (
            <div className="relative w-full max-w-md rounded-xl p-0.5">
                <GlowEffect
                    colors={['#FFFFFF', '#A0A0A0', '#FFFFFF']}
                    mode='rotate'
                    blur='strong'
                    className="rounded-xl"
                />

                <div className="relative bg-zinc-950 p-8 md:p-12 rounded-xl shadow-lg text-center h-full w-full">
                    <h2 className="text-2xl font-bold md:text-2xl mb-4">Welcome to the Staking dApps</h2>
                    <p className="text-slate-400 text-lg">Please connect your MetaMask or any Wallet to log in.</p>

                    <svg
                        role='img'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 70 70'
                        aria-label='MP Logo'
                        className='absolute bottom-4 right-4 h-8 w-8 text-white'
                        fill='none'
                    >
                        <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeWidth='3'
                            d='M51.883 26.495c-7.277-4.124-18.08-7.004-26.519-7.425-2.357-.118-4.407-.244-6.364 1.06M59.642 51c-10.47-7.25-26.594-13.426-39.514-15.664-3.61-.625-6.744-1.202-9.991.263'
                        ></path>
                    </svg>
                </div>
            </div>
        );
    }

    const stakedAmountFormatted = stakedInfo ? stakedInfo[0] : BigInt(0);
    const pendingRewardFormatted = pendingReward || BigInt(0);

    const isInteracting = isApproving || isStaking || isUnstaking || isClaiming;

    return (
        <div className="relative w-full max-w-md">
            <GlowEffect
                colors={['#FFFFFF', '#A0A0A0', '#FFFFFF']}
                mode='pulse'
                blur='strong'
                className="rounded-xl"
            />
            <div className="relative bg-zinc-950 p-8 rounded-xl shadow-lg w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Stake Your Tokens</h2>
                <div className="space-y-4 mb-6 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Your STK Balance:</span>
                        <span className="font-bold">
                            {`${parseFloat(stakeTokenBalance?.formatted || '0').toFixed(2)} STK`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Amount Stake:</span>
                        <span className="font-bold">
                            {`${ethers.formatEther(stakedAmountFormatted)} STK`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Your Reward:</span>
                        <span className="font-bold text-emerald-400">
                            {`${ethers.formatEther(pendingRewardFormatted)} RWD`}
                        </span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="stakeAmount" className="block text-sm font-medium text-slate-300 mb-1">
                            Stake / Unstake Amount
                        </label>
                        <InputGroup>
                            <InputAddon mode="icon">
                                <RiCopperCoinLine />
                            </InputAddon>
                            <Input
                                type="number"
                                id="stakeAmount"
                                placeholder="0.0"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                disabled={isInteracting}
                            />
                        </InputGroup>
                    </div>
                    <div className="flex space-x-4">
                        <Button
                            onClick={handleStake}
                            disabled={isInteracting}
                            className="flex-1">
                            {isApproving ? 'Approving...' : isConfirmingApprove ? 'Confirming...' : isStaking ? 'Staking...' : isConfirmingStake ? 'Confirming...' : 'Stake'}
                        </Button>
                        <Button
                            onClick={handleUnstake}
                            disabled={isInteracting}
                            variant="destructive"
                            className="flex-1">
                            {isUnstaking ? 'Unstaking...' : isConfirmingUnstake ? 'Confirming...' : 'Unstake'}
                        </Button>
                    </div>
                    <Button
                        onClick={handleClaimReward}
                        disabled={isInteracting}
                        variant="secondary"
                        className="w-full"
                    >
                        {isClaiming ? 'Claiming...' : isConfirmingClaim ? 'Confirming...' : 'Claim Reward'}
                    </Button>
                </div>
            </div>
        </div>
    );
}