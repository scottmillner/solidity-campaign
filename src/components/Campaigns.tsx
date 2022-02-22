import { Campaign } from '../types';
import { truncateAddress } from '../utils';

interface CampaignsProps {
	campaigns: Campaign[];
}

export const Campaigns: React.FC<CampaignsProps> = ({ campaigns }) => {
	return (
		<div className='flex flex-col gap-4 mx-4'>
			<p className='text-3xl font-medium'>Open Campaigns</p>
			<div className='flex flex-col flex-wrap sm:flex-row gap-6'>
				{campaigns.map((campaign) => {
					return (
						<div key={campaign.address} className='p-4 bg-aqua rounded-5'>
							<p className='text-xl text-slate-800'>{truncateAddress(campaign.address)}</p>
							<a href='' className='text-lg text-white font-medium'>
								View Contract
							</a>
						</div>
					);
				})}
			</div>
		</div>
	);
};

Campaigns.displayName = 'Campaigns';
Campaigns.whyDidYouRender = false;
