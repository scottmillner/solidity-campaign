import { HttpProvider } from 'web3-core';

// Enums
export enum AddressLength {
	SHORT,
	MEDIUM,
	LONG,
}

export enum AlertMessage {
	NotConnected = 'Your wallet is not connected',
	WrongNetworkMetaMask = 'Click to connect MetaMask to the Ropsten testnet.',
	WrongNetworkWalletConnect = 'Please connect your wallet to the Ropsten testnet.',
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

export enum ConnectText {
	ConnectViaMetaMask = 'MetaMask',
	ConnectViaWalletConnect = 'WalletConnect',
	Disconnect = 'Disconnect',
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

export interface Request {
	description?: string;
	value?: number;
	recipient?: string;
	approvalCount?: number;
	approve?: JSX.Element | string;
	finalize?: JSX.Element | string;
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
