'use client'

import { ClaimNftModal } from './claim-nft-modal'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { ConnectWallet } from './connect-wallet'
import { baseURI } from '@/utils/queries'

export const ClaimNft = ({
	onClose,
	freeNft,
	brandName,
	contractAddress,
}: {
	onClose: (state: boolean) => void
	freeNft: string
	brandName: string
	contractAddress: string
}) => {
	const [claimNft, setClaimNft] = useState(false)
	const account = useAccount()

	const mintFanToken = async () => {
		const response = await fetch(`${baseURI}/delegate-mint-fantoken`, {
			method: 'POST',
			body: JSON.stringify({
				creatorWallet: account.address,
				nftContractAddress: contractAddress,
				amount: '1',
				data: '0x0',
			}),
		})

		const hash = await response.json()

		if (hash && hash.txHash) {
			setClaimNft(true)
		}
	}

	const removePrefix = (uri: string) => {
		return uri?.substring(7, uri.length)
	}

	return (
		<>
			{!claimNft ? (
				<div className='relative bg-white p-4 text-black rounded-lg shadow-md'>
					<div className='p-4 space-y-4'>
						<div className='flex justify-around'>
							<p className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-900 text-center'>
								Congratulations!
							</p>
						</div>

						<div className='flex justify-around'>
							<Image
								src='/trophy2.png'
								alt='trophy image'
								height={50}
								width={150}
							/>
							<Image
								src={`https://nftstorage.link/ipfs/${removePrefix(freeNft)}`}
								alt='Free NFT Image'
								height={80}
								width={120}
								className='mt-16'
							/>
							<Image
								src='/trophy1.png'
								alt='trophy image'
								height={50}
								width={150}
							/>
						</div>

						<p className='text-lg text-center px-10 py-4'>
							You are eligible to claim a free NFT fan token to show your
							support to {brandName} and get a chance to earn weekly rewards.
						</p>
					</div>

					<div className='flex items-center pb-4'>
						<button
							className='w-1/3 mx-auto text-black focus:ring-4 outline-none rounded-full text-lg py-1 text-center bg-blue-400'
							onClick={() => {
								if (!account.address) {
									toast.warning('Connect or Create a wallet')
								} else {
									mintFanToken()
								}
							}}
						>
							Claim Free NFT
						</button>
					</div>

					<div className='flex justify-center pb-4 mx-auto'>
						{!account.address && <ConnectWallet />}
					</div>
				</div>
			) : (
				<ClaimNftModal
					onClose={onClose}
					brandName={brandName}
					freeNft={freeNft}
				/>
			)}
		</>
	)
}
