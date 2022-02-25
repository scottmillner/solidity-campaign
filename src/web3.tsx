import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { provider } from 'web3-core/types/index';
import { printError } from './utils';
import { Ethereum, EthereumError } from './types';
import CloneFactory from './ethereum/contracts/build/CloneFactory.json';

const ethereum = window.ethereum as Ethereum;
const cloneFactoryAddress = '0xf46901344B3549Bd6aCb67e7801d25745F4426C7';

type SetAlertOpen = React.Dispatch<React.SetStateAction<boolean>>;
interface Web3Result {
	accounts: string[];
	contractInstance: Contract;
	web3: Web3;
}

export const getWeb3ResultAsync: (setAlertOpen: SetAlertOpen) => Promise<Web3Result | null> = async (setAlertOpen: SetAlertOpen) => {
	const provider = (await detectEthereumProvider()) as provider;
	if (provider && provider === ethereum) {
		try {
			// Expose accounts
			await ethereum.request({ method: 'eth_requestAccounts' });
			const web3 = new Web3(provider);
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
