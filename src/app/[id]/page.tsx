'use client'
import { InfoCard } from '@/components/info-card'

import Image from 'next/image'
import { Avatar } from '@readyplayerme/visage'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/components/connect-wallet'
import { useEffect, useState } from 'react'
import { ConnectWalletModal } from '@/components/connect-wallet-modal'
import { NfcMintPopUp } from '@/components/nfc-mint-popup'
import { ClaimNft } from '@/components/claim-nft'

import { CreateWallet } from '@/components/create-wallet'
import { VoiceAssistant } from '@/components/voice-assistant'

export default function Home({ params }: { params: { id: string } }) {
	const { id } = params

	console.log(id)

	const [unlockModal, setUnlockModal] = useState(false)
	const [unlocked, setUnlocked] = useState(true)
	const [unlockClaimed, setUnlockClaimed] = useState(false)

	const [phygitalData, setPhygitalData] = useState<any>([])
	const [webXrData, setWebXrData] = useState<any>([])
	const [avatar, setAvatar] = useState<any>([])
	const [productInfo, setProductInfo] = useState<any>('')

	const account = useAccount()

	const closeCongratulations = () => {
		setUnlockModal(false)

		// setTimeout(() => {
		// 	setUnlockClaimed(true)
		// 	setUnlocked(true)
		// }, 2000)
	}

	const closeClaimed = () => {
		setUnlockClaimed(false)
	}

	const fetchPhygitalData = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_URI}/phygitals/${id}`)

			const webxr = await fetch(
				`${process.env.NEXT_PUBLIC_URI}/webxr/1a8afbe5-c49a-42e6-9247-a67cf7c3bf3b`
			)

			const avatarRes = await fetch(
				`${process.env.NEXT_PUBLIC_URI}/avatars/884417d7-076d-464b-9827-cc32c12bd911`
			)

			const data = await res.json()
			const webdata = await webxr.json()
			const avatardata = await avatarRes.json()

			console.log(data)
			console.log(webdata)

			setProductInfo(data.product_info)
			setPhygitalData(data)
			setWebXrData(webdata)
			setAvatar(avatardata)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchPhygitalData()

		// if (account.address) {
		setTimeout(() => {
			setUnlockClaimed(true)
			// 	setUnlocked(false)
		}, 30000)
	}, [])

	const removePrefix = (uri: any) => {
		return uri?.substring(7, uri.length)
	}

	console.log(webXrData.image360)

	return (
		<main className='flex h-screen flex-col items-center justify-between p-24 relative'>
			<header className='absolute top-0 p-4 w-full flex justify-between z-10'>
				<Image src='/logo.png' alt='logo' height={150} width={250} />
				<ConnectWallet />
				{/* <CreateWallet /> */}
			</header>

			<a-scene className='h-48'>
				<a-sky
					src={
						webXrData.image360 &&
						`${'https://nftstorage.link/ipfs'}/${removePrefix(
							webXrData.image360
						)}`
					}
					rotation='0 -130 0'
				></a-sky>
			</a-scene>
			<section>
				<div className='absolute right-2 bottom-2'>
					<InfoCard phygital={phygitalData} />
				</div>

				<div className='absolute left-[35%] text-white bottom-2'>
					<VoiceAssistant productInfo={productInfo} />
				</div>
				<div className='absolute h-3/4 left-4 bottom-16'>
					<Avatar modelSrc={avatar && avatar.url} cameraInitialDistance={3.5} />
					<button className='border-2 border-white text-white bg-black mx-auto flex item-center gap-4 justify-center bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-full px-8 py-2'>
						Unlock
					</button>
				</div>
				{!account.address && (
					<div className='absolute inset-0'>
						<ConnectWalletModal />
					</div>
				)}
				{account.address && unlockModal && (
					<div className='absolute inset-0'>
						<NfcMintPopUp
							onClose={closeCongratulations}
							phygitalName={phygitalData.name}
						/>
					</div>
				)}
				{unlockClaimed && (
					<div className='absolute inset-0'>
						<ClaimNft
							onClose={closeClaimed}
							freeNft={webXrData.free_nft_image}
							brandName={phygitalData.brand_name}
						/>
					</div>
				)}
			</section>
		</main>
	)
}
