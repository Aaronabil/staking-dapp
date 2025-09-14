'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: React.ReactNode
}

export default function FAQsThree() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            icon: 'square-stack',
            question: 'What is staking?',
            answer: 'Staking is similar to a savings deposit at a bank. You "lock" your STK tokens in our smart contract. In return for helping to secure and support the ecosystem, you will continuously receive rewards in RWD tokens.',
        },
        {
            id: 'item-2',
            icon: 'circle-play',
            question: 'How do I get started?',
            answer: (
                <>
                    <div>Its easy! Just follow these four steps:</div>

                    <ol className="list-decimal list-inside space-y-2 mt-4 text-left">
                        <li>
                            <strong>Get STK Tokens:</strong> Make sure you have a StakeToken (STK) balance in your wallet. For now on the testnet, these tokens are minted by the contract owner.
                        </li>
                        <li>
                            <strong>Connect Wallet:</strong> Click the Connect Wallet button to connect your Web3 wallet (like MetaMask).
                        </li>
                        <li>
                            <strong>Approve & Stake:</strong> Enter the amount of STK you wish to stake. You will be prompted for two transactions: first to Approve (giving the contract permission to use your STK) and second to Stake (depositing your STK into the contract).
                        </li>
                        <li>
                            <strong>Done!</strong> You will immediately start earning RWD rewards every second.
                        </li>
                    </ol>
                </>
            ),
        },
        {
            id: 'item-3',
            icon: 'gift',
            question: 'How are rewards calculated?',
            answer: (
                <>
                    <div>Rewards are calculated in real-time based on two main factors:</div>
                    <ol className="list-decimal list-inside space-y-2 mt-4 text-left">
                        <li>
                            The amount of STK tokens you have staked.
                        </li>
                        <li>
                            The duration of your stake.
                        </li>
                    </ol>
                    <br />
                    <div>The more you stake and the longer you stake, the more RWD rewards you will accumulate.</div>
                </>
            ),
        },
        {
            id: 'item-4',
            icon: 'coins',
            question: 'Whats the difference between STK and RWD tokens?',
            answer: (
                <>
                    <ul className="list-disc list-inside space-y-2 text-left">
                        <li>
                            STK (Stake Token): This is your principal token. Its the asset you lock into the platform.
                        </li>
                        <li>
                            RWD (Reward Token): This is your yield token. Its the asset you earn as a reward for staking.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 'item-5',
            icon: 'banknote-arrow-down',
            question: 'Can I withdraw my tokens at any time?',
            answer: 'Yes. Our dApp has no lock-up period. You can unstake some or all of your STK tokens at any time. When you unstake, any pending RWD rewards will also be automatically claimed to your wallet.',
        },
        {
            id: 'item-6',
            icon: 'lock',
            question: 'Is this secure?',
            answer: 'Our platform runs entirely on decentralized smart contracts on the Ethereum blockchain. All logic and transactions are transparent and publicly verifiable on Etherscan. You always maintain full control of your assets through your personal wallet.',
        },
    ]

    return (
        <section className="bg-muted dark:bg-background py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can&apos;t find what you&apos;re looking for? Contact our{' '}
                                <Link
                                    href="#"
                                    className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon
                                                    name={item.icon}
                                                    className="m-auto size-4"
                                                />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
