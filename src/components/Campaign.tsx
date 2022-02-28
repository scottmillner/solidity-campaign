import { AddressLength, Campaign } from '../types';
import { truncateAddress } from '../utils';

interface CampaignProps {
	campaign: Campaign;
}

export const SelectedCampaign: React.FC<CampaignProps> = ({ campaign }) => {
	return (
		<div className='flex flex-wrap gap-2'>
			<div className='card'>
				<a href={`https://ropsten.etherscan.io/address/${campaign.address}`} target='_blank' className='underline text-aqua' rel='noreferrer'>
					Campaign Contract on Etherscan
				</a>
				<div className='mt-4 item-text'>Manager Address</div>
				<a href={`https://ropsten.etherscan.io/address/${campaign.manager}`} target='_blank' className='underline text-aqua' rel='noreferrer'>
					{truncateAddress(campaign.manager)}
				</a>
				<p className='mt-4 p-text'>The manager created this campaign and can create requests to withdraw money.</p>
			</div>
			<div className='card'>
				<div>{campaign.minimumContribution} WEI</div>
				<div className='item-text'>Minimum Contribution</div>
				<p className='mt-4 p-text'>You must contribute at least this much WEI to become an approver.</p>
			</div>
			<div className='card'>
				<div>{campaign.requestsCount}</div>
				<div className='item-text'>Number of Requests</div>
				<p className='mt-4 p-text'>A request tries to withdraw money from the contract. Requests must be appproved by approvers.</p>
			</div>
			<div className='card'>
				<div>{campaign.approversCount}</div>
				<div className='item-text'>Number of Approvers</div>
				<p className='mt-4 p-text'>The number of people who have already donated to this campaign.</p>
			</div>
			<div className='card'>
				<div>{campaign.balance} ETH</div>
				<div className='item-text'>Campaign balance</div>
				<p className='mt-4 p-text'>The balance is how much money this campaign has left to spend.</p>
			</div>
		</div>
	);
};

SelectedCampaign.displayName = 'SelectedCampaign';
SelectedCampaign.whyDidYouRender = false;
