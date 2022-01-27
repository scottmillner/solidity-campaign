import { Fragment, Suspense, useEffect, useState } from 'react';
import { MetaMaskIcon } from '../images/index';
import MetaMaskOnboarding from '@metamask/onboarding';
import { getWeb3ResultAsync, reconnectWalletAsync } from '../web3';
import { Contract } from 'web3-eth-contract';
import { MenuAlt2Icon, XIcon } from '@heroicons/react/outline';
import Web3 from 'web3';
import { classNames, truncateAddress } from '../utils';
import { AddressLength, AlertMessage, Ethereum, PathName } from '../types';
import { Alert } from './ui/Alert';
import { Dialog, Transition } from '@headlessui/react';
import { Link, Route, Routes } from 'react-router-dom';
import { Spinner } from './ui/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { Campaigns } from './Campaigns';
import { useInterval } from './hooks/useInterval';

interface Navigation {
	name: string;
	to: string;
	icon?: JSX.Element;
	current: boolean;
}

export const Main: React.FC = () => {
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const [alertOpen, setAlertOpen] = useState<boolean>(false);
	const [accounts, setAccounts] = useState<string[]>();
	const [cloneFactory, setCloneFactory] = useState<Contract>();
	const [toggle, setToggle] = useState<boolean>(false);
	const [pathName, setPathName] = useState<string>(window.location.pathname);
	const [web3, setWeb3] = useState<Web3>();

	const ethereum = window.ethereum as Ethereum;
	const userAccount = accounts && accounts[0];
	const isCorrectNetwork = ethereum?.networkVersion === '3';

	const homeIcon = <FontAwesomeIcon icon={faHouseUser} size='2x' color='#11B4BF' />;
	const navigation: Navigation[] = [{ name: 'home', to: PathName.Home, icon: homeIcon, current: pathName === PathName.Home }];

	const onboarding = new MetaMaskOnboarding();
	const connectWallet: () => void = async () => {
		const web3Result = await getWeb3ResultAsync(setAlertOpen);
		if (web3Result) {
			if (ethereum.networkVersion !== '3') setAlertOpen(true);
			const { accounts, contractInstance, web3 } = web3Result;
			setAccounts(accounts);
			setCloneFactory(contractInstance);
			setWeb3(web3);
			setIsConnected(true);
		}
	};

	const addCampaignsAsync: (addresses: string[]) => void = (addresses) => {};

	const createCampaignsAsync: () => void = async () => {
		const campaigns = await cloneFactory?.methods.getCampaigns().call();
		if (campaigns) addCampaignsAsync(campaigns);
	};

	useEffect(() => {
		if (isCorrectNetwork) createCampaignsAsync();
	}, [cloneFactory, accounts, web3]);

	// Get campaigns every 30 seconds
	useInterval(() => {
		createCampaignsAsync();
	}, 30000);

	const connectClickHander: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
		// Onboard metamask if not installed
		if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
			onboarding.startOnboarding();
		} else {
			onboarding.stopOnboarding();
		}

		if (!isConnected) {
			connectWallet();
		} else {
			reconnectWalletAsync();
			setIsConnected(false);
		}
	};

	const getTruncatedWalletAddress: () => string | null = () => {
		if (userAccount) {
			return truncateAddress(userAccount, AddressLength.LONG);
		}

		return null;
	};

	const getPageTitle: () => string = () => {
		if (pathName === PathName.Home) return '';
		return '';
	};

	// Content setup
	const ActionButton: JSX.Element = (
		<button type='button' className='btn-wallet w-60 h-12 rounded-5 bg-aqua text-sm font-Inter' onClick={connectClickHander}>
			<span className='mr-4'>Connect Via MetaMask</span>
			<MetaMaskIcon />
		</button>
	);

	const routes = (
		<Suspense fallback={<Spinner />}>
			<Routes>
				<Route path={PathName.Home} element={<Campaigns />} />
			</Routes>
		</Suspense>
	);

	const getContent: () => JSX.Element | undefined = () => {
		if (!isConnected) return ActionButton;
		if (!isCorrectNetwork) return;
		return routes;
	};

	const getAlertMessage: () => string = () => {
		if (!isCorrectNetwork) return AlertMessage.WrongNetwork;
		if (!isConnected) return AlertMessage.NotConnected;
		return AlertMessage.NotConnected;
	};

	const changeNetworkAsync: () => void = async () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const result = await ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: web3?.utils.toHex(3) }],
		});
		setAlertOpen(false);
		connectWallet();
	};

	return (
		<div id='main' className='h-screen flex overflow-hidden font-Inter'>
			<Alert message={getAlertMessage()} open={alertOpen} setOpen={setAlertOpen} onClick={changeNetworkAsync} />
			{/* collapsable sidebar: below lg breakpoint */}
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as='div' static className='fixed inset-0 flex z-40 lg:hidden' open={sidebarOpen} onClose={setSidebarOpen}>
					<Transition.Child
						as={Fragment}
						enter='transition-opacity ease-linear duration-300'
						enterFrom='entertfrom-leaveto-opacity'
						enterTo='enterto-enterleave-opacity'
						leave='transition-opacity ease-linear duration-300'
						leaveFrom='enterto-enterleave-opacity'
						leaveTo='entertfrom-leaveto-opacity'
					>
						<Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-75' />
					</Transition.Child>
					<Transition.Child
						as={Fragment}
						enter='transition ease-in-out duration-300 transform'
						enterFrom='-translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='-translate-x-full'
					>
						<div className='relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white'>
							<Transition.Child
								as={Fragment}
								enter='ease-in-out duration-300'
								enterFrom='entertfrom-leaveto-opacity'
								enterTo='enterto-enterleave-opacity'
								leave='ease-in-out duration-300'
								leaveFrom='enterto-enterleave-opacity'
								leaveTo='entertfrom-leaveto-opacity'
							>
								<div className='absolute top-0 right-0 -mr-12 pt-2'>
									<button
										type='button'
										className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
										onClick={() => setSidebarOpen(false)}
									>
										<span className='sr-only'>Close sidebar</span>
										<XIcon className='h-6 w-6 text-aqua' aria-hidden='true' />
									</button>
								</div>
							</Transition.Child>
							<div className='mt-5 flex-1 h-0 overflow-y-auto'>
								<nav className='px-2 space-y-1'>
									{navigation.map((item) => (
										<Link
											key={item.name}
											to={item.to}
											className={classNames(
												item.current ? 'text-lumerin-aqua' : 'text-gray-500',
												'flex items-center px-2 py-2 text-md font-medium rounded-md'
											)}
											onClick={() => setToggle(!toggle)}
										>
											<div className='flex items-baseline gap-2'>
												<div>{item.icon}</div>
												<span>{item.name}</span>
											</div>
										</Link>
									))}
								</nav>
							</div>
						</div>
					</Transition.Child>
					<div className='flex-shrink-0 w-14' aria-hidden='true'>
						{/* Dummy element to force sidebar to shrink to fit close icon */}
					</div>
				</Dialog>
			</Transition.Root>
			{/* <div className={!isConnected ? 'm-8' : 'hidden'}>
				<LogoIcon />
			</div> */}

			{/* Static sidebar for desktop */}
			<div className={!isConnected ? 'hidden' : 'hidden bg-white lg:flex lg:flex-shrink-0'}>
				<div className='flex flex-col w-48'>
					<div className='flex flex-col pt-4 pb-4 overflow-y-auto'>
						<div className='flex-1 flex flex-col'>
							<nav className='flex-1 px-2 space-y-1'>
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.to}
										className={classNames(
											item.current ? 'text-lumerin-aqua' : 'text-lumerin-dark-aqua',
											'flex items-center px-2 py-2 text-md font-medium rounded-md'
										)}
										onClick={() => setToggle(!toggle)}
									>
										<div className='flex items-baseline gap-2'>
											<div>{item.icon}</div>
											<span>{item.name}</span>
										</div>
									</Link>
								))}
							</nav>
						</div>
					</div>
				</div>
			</div>
			<div className='flex flex-col w-0 flex-1 overflow-hidden bg-white'>
				<div className={!isConnected ? 'hidden' : 'relative z-10 flex-shrink-0 flex h-20 bg-white'}>
					<button
						type='button'
						className={
							!isConnected
								? 'hidden'
								: 'px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden'
						}
						onClick={() => setSidebarOpen(true)}
					>
						<span className='sr-only'>Open sidebar</span>
						<MenuAlt2Icon className='h-6 w-6' aria-hidden='true' />
					</button>
					<div className={!isConnected ? 'hidden' : 'flex items-center ml-4 xl:ml-0'}>
						<p className='text-lg text-lumerin-dark-aqua font-semibold'>{getPageTitle()}</p>
					</div>
					<div className={isConnected ? 'flex-1 px-4 flex justify-end' : 'hidden'}>
						{isConnected ? (
							<button className='btn-connected w-64 cursor-default'>
								<span className='mr-4'>{getTruncatedWalletAddress()}</span>
								<MetaMaskIcon />
							</button>
						) : null}
					</div>
				</div>
				<main
					className={classNames(
						isConnected ? 'mr-0 lg:mr-48' : 'm-auto',
						'flex justify-center relative overflow-y-auto focus:outline-none'
					)}
				>
					{getContent()}
				</main>
			</div>
		</div>
	);
};

Main.displayName = 'Main';
Main.whyDidYouRender = false;
