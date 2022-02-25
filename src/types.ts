import { HttpProvider } from 'web3-core';

// Enums
export enum AddressLength {
	SHORT,
	MEDIUM,
	LONG,
}

export enum AlertMessage {
	NotConnected = 'MetaMask is not connected',
	WrongNetwork = 'Please connect to the Ropsten testnet.',
}

export enum PathName {
	Home = '/',
	Campaign = '/campaign',
}
export enum ContentState {
	Create = 'CREATE',
	Review = 'REVIEW',
	Confirm = 'CONFIRM',
	Pending = 'PENDING',
	Complete = 'COMPLETE',
}

// Interfaces
export interface Ethereum extends HttpProvider {
	networkVersion: string;
	on: <T>(method: string, callback: (input: T) => void) => void;
	request: (options: {}) => void;
}

export interface EthereumError extends Error {
	code: number;
}

export interface Campaign {
	address: string;
	minimumContribution: number;
	balance: number;
	requestsCount: number;
	approversCount: number;
	manager: string;
}

export interface Receipt {
	status: boolean;
}
