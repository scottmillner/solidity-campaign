import { Campaign } from '../types';

interface CampaignProps {
	campaign: Campaign;
}

export const SelectedCampaign: React.FC<CampaignProps> = ({ campaign }) => {
	return (
		<div>
			<div>Campaign {campaign.address}</div>
			<div>Minimum Contribution: {campaign.minimumContribution} GWEI</div>
			<div>Balance: {campaign.balance} GWEI</div>
			<div>Requests Count: {campaign.requestsCount}</div>
			<div>Approvers Count: {campaign.approversCount}</div>
			<div>Manager: {campaign.manager}</div>
		</div>
	);
};

SelectedCampaign.displayName = 'SelectedCampaign';
SelectedCampaign.whyDidYouRender = false;
