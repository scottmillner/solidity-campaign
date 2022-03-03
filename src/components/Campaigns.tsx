import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { Campaign, PathName } from '../types';
import { truncateAddress } from '../utils';

interface CampaignsProps {
	campaigns: Campaign[];
	setSelectedCampaign: Dispatch<SetStateAction<string>>;
}

export const Campaigns: React.FC<CampaignsProps> = ({ campaigns, setSelectedCampaign }) => {
	return (
		<div className='flex flex-col gap-4 mx-4 lg:ml-0'>
			<p className='text-3xl font-medium'>Open Campaigns</p>
			<div className='flex flex-col flex-wrap sm:flex-row gap-6'>
				{campaigns.map((campaign, index) => {
					return (
						<div key={campaign.address} className='p-4 bg-aqua rounded-5'>
							<p className='text-xl text-slate-800'>{truncateAddress(campaign.address)}</p>
							<Link
								key={index}
								to={`${PathName.Campaign}/${campaign.address.toLowerCase()}`}
								onClick={() => setSelectedCampaign(campaign.address)}
								className='text-lg text-white font-medium'
							>
								View Campaign
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};

Campaigns.displayName = 'Campaigns';
Campaigns.whyDidYouRender = false;
