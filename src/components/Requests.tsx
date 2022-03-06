import { useEffect, useMemo, useState } from 'react';
import { Column, useTable } from 'react-table';
import Web3 from 'web3';
import { Campaign, Request } from '../types';
import { Table } from './Table';
import CampaignContract from '../ethereum/contracts/build/Campaign.json';
import { AbiItem } from 'web3-utils';
import { printError } from '../utils';
import { Spinner } from './ui/Spinner';

interface RequestsProps {
	campaign: Campaign;
	web3: Web3 | undefined;
}
export const Requests: React.FC<RequestsProps> = ({ campaign, web3 }) => {
	const [requests, setRequests] = useState<Request[]>([]);

	interface TableInstance extends Request {}
	const columns: Column<Request>[] = useMemo(
		() => [
			{ Header: 'Description', accessor: 'description' },
			{ Header: 'Amount', accessor: 'amount' },
			{ Header: 'Recipient', accessor: 'recipient' },
			{ Header: 'Approval Count', accessor: 'approvalCount' },
		],
		[]
	);

	const data = useMemo(() => requests, [requests]);
	const tableInstance = useTable<TableInstance>({ columns, data });

	const getRequestsAsync: () => void = async () => {
		if (web3) {
			const campaignContract = new web3.eth.Contract(CampaignContract.abi as AbiItem[], campaign.address);
			try {
				const requestCount = parseInt(await campaignContract.methods.getRequestCount().call());
				if (requestCount) {
					const array: string[] = [];
					for (let i = 0; i < requestCount; i++) array.push('');
					const requests: Request[] = await Promise.all(array.map((_, index) => campaignContract.methods.requests(index).call()));
					setRequests(requests);
				} else {
					setRequests([]);
				}
			} catch (error) {
				const typedError = error as Error;
				printError(typedError.message, typedError.stack as string);
			}
		}
	};

	useEffect(() => {
		getRequestsAsync();
	}, [campaign]);

	return <div>{requests.length === 0 ? <Spinner /> : <Table tableInstance={tableInstance} />}</div>;
};

Requests.displayName = 'Requests';
Requests.whyDidYouRender = false;