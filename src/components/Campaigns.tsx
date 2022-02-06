import { Campaign } from '../types';
import { truncateAddress } from '../utils';

interface CampaignsProps {
	campaigns: Campaign[];
}

export const Campaigns: React.FC<CampaignsProps> = ({ campaigns }) => {
	return (
		<div className='flex'>
			{campaigns.map((campaign) => {
				return (
					<div key={campaign.address}>
						<p className='text-xl'>{truncateAddress(campaign.address)}</p>
						<a href='' className='text-lg text-aqua font-medium'>
							View Contract
						</a>
					</div>
				);
			})}
		</div>
	);
};

Campaigns.displayName = 'Campaigns';
Campaigns.whyDidYouRender = false;
