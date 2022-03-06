import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { provider } from 'web3-core/types/index';
import { printError } from './utils';
import { ConnectText, Ethereum, EthereumError } from './types';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CloneFactory from './ethereum/contracts/build/CloneFactory.json';

const ethereum = window.ethereum as Ethereum;
const cloneFactoryAddress = '0x9CE78F08Efb453CD2c9Cee959859b04c151e9F12';

type SetAlertOpen = React.Dispatch<React.SetStateAction<boolean>>;
interface Web3Result {
	accounts: string[];
	contractInstance: Contract;
	web3: Web3;
}

const getProviderAsync: (walletName: string) => Promise<provider | WalletConnectProvider> = async (walletName) => {
	switch (walletName) {
		case ConnectText.ConnectViaMetaMask:
			return (await detectEthereumProvider()) as provider;
		default:
			return new WalletConnectProvider({
				rpc: {
					1: 'https://eth.connect.bloq.cloud/v1/stable-relax-science',
					3: 'https://ropsten.connect.bloq.cloud/v1/stable-relax-science',
				},
				chainId: 3,
				clientMeta: {
					description: 'Welcome to the Lumerin Token Distribution site. Claim your LMR tokens here.',
					url: 'https://token.sbx.lumerin.io',
					icons: [''],
					name: 'Lumerin Token Distribution',
				},
			});
	}
};

export const getWeb3ResultAsync: (walletName: string, setAlertOpen: SetAlertOpen) => Promise<Web3Result | null> = async (
	walletName,
	setAlertOpen
) => {
	const provider = await getProviderAsync(walletName);
	if (provider) {
		try {
			// Expose accounts
			if (walletName === ConnectText.ConnectViaMetaMask) await ethereum.request({ method: 'eth_requestAccounts' });
			else await (provider as WalletConnectProvider).enable();
			const web3 = new Web3(provider as provider);
			const accounts = await web3.eth.getAccounts();
			if (accounts.length === 0 || accounts[0] === '') {
				setAlertOpen(true);
			}

			const contractInstance = new web3.eth.Contract(CloneFactory.abi as AbiItem[], cloneFactoryAddress);

			return { accounts, contractInstance, web3 };
		} catch (error) {
			const ethereumError = error as EthereumError;
			printError(ethereumError.message, ethereumError.stack as string);
			return null;
		}
	}
	return null;
};

// Allows user choose which account they want to use in MetaMask
export const reconnectWalletAsync: () => void = async () => {
	await ethereum?.request({
		method: 'wallet_requestPermissions',
		params: [
			{
				eth_accounts: {},
			},
		],
	});
};
