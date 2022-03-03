import { Campaign, ContentState, PathName, Receipt } from '../types';
import { classNames, truncateAddress } from '../utils';
import { useForm } from 'react-hook-form';
import { Modal } from './ui/Modal';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import CampaignContract from '../ethereum/contracts/build/Campaign.json';
import { AbiItem } from 'web3-utils';
import { CloseModalIcon } from './ui/CloseModalIcon';
import { Spinner } from './ui/Spinner';
import { Link } from 'react-router-dom';

interface CampaignProps {
	web3: Web3 | undefined;
	userAccount: string | undefined;
	campaign: Campaign;
}

interface FormData {
	contribution: number;
}
export const SelectedCampaign: React.FC<CampaignProps> = ({ web3, userAccount, campaign }) => {
	const [open, setOpen] = useState<boolean>(false);
	const [contentState, setContentState] = useState<string>(ContentState.Review);
	const [formData, setFormData] = useState<FormData>({ contribution: campaign.minimumContribution });

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<FormData>({ mode: 'onBlur' });

	const createTransactionAsync: (data: FormData) => void = async (data) => {
		// Review
		if (isValid && contentState === ContentState.Review) {
			setContentState(ContentState.Confirm);
			setFormData({ contribution: data.contribution });
		}

		// Confirm
		if (isValid && contentState === ContentState.Confirm) {
			setContentState(ContentState.Pending);
		}

		// Pending
		if (isValid && contentState === ContentState.Pending) {
			try {
				if (web3) {
					const campaignContract = new web3.eth.Contract(CampaignContract.abi as AbiItem[], campaign.address);
					const receipt: Receipt = await campaignContract?.methods.contribute().send({ from: userAccount, value: formData.contribution });
					if (receipt?.status) setContentState(ContentState.Complete);
				}
			} catch (error) {
				setOpen(false);
				reset({ contribution: campaign.minimumContribution });
				setContentState(ContentState.Review);
			}
		}
	};

	const ContributeForm = (
		<div className={contentState === ContentState.Review ? 'hidden' : 'bg-white text-black px-6 py-8 md:px-16 border-transparent rounded-5'}>
			<CloseModalIcon setOpen={setOpen} onCloseHandler={() => setContentState(ContentState.Review)} />
			{contentState === ContentState.Confirm ? (
				<div className='flex flex-col w-full items-center mb-4'>
					<p className='text-slate-800 text-xl'>Review the contribution amount and confirm.</p>
					<div className='w-full confirm-div'>
						<p className='font-medium'>Contribution Amount:</p>
						<p className='ml-4 font-medium'>{formData.contribution} WEI</p>
					</div>
				</div>
			) : null}
			{contentState === ContentState.Pending || contentState === ContentState.Complete ? (
				<div className={classNames(contentState === ContentState.Pending ? 'mb-4' : '', 'flex flex-col w-full items-center')}>
					<p className={classNames(contentState === ContentState.Pending ? 'mb-8' : '', 'text-center text-xl')}>
						{contentState === ContentState.Pending ? 'Your transaction is pending.' : 'Your contribution was created successfully!'}
					</p>
					{contentState === ContentState.Pending ? <Spinner /> : null}
				</div>
			) : null}
			{contentState === ContentState.Confirm ? (
				<div className='flex justify-center items-center'>
					<button
						className='btn-standard h-16 w-full pt-0 text-2xl text-center'
						onClick={handleSubmit((data) => createTransactionAsync(data))}
					>
						Confirm
					</button>
				</div>
			) : null}
		</div>
	);

	// Create transaction when in pending state
	// Reset form when transaction complete or rejected
	useEffect(() => {
		if (contentState === ContentState.Pending) createTransactionAsync(formData);
		if (contentState === ContentState.Review || contentState === ContentState.Complete) reset({ contribution: campaign.minimumContribution });
	}, [contentState]);

	return (
		<div className='px-4 md:px-0'>
			<Modal open={open} setOpen={setOpen} content={ContributeForm} onCloseHandler={() => setContentState(ContentState.Review)} />
			<div className='flex flex-col'>
				<div className='flex flex-col xl:flex-row xl:flex-wrap gap-4 xl:px-0'>
					<div className='card'>
						<a
							href={`https://ropsten.etherscan.io/address/${campaign.address}`}
							target='_blank'
							className='underline text-aqua'
							rel='noreferrer'
						>
							Campaign on Etherscan
						</a>
						<div className='mt-4 item-text'>Manager Address</div>
						<a
							href={`https://ropsten.etherscan.io/address/${campaign.manager}`}
							target='_blank'
							className='underline text-aqua overflow-hidden'
							rel='noreferrer'
						>
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
						<div>
							{parseFloat(web3?.utils.fromWei(campaign.balance.toString(), 'ether') as string).toLocaleString('en-US', {
								maximumFractionDigits: 18,
							})}{' '}
							ETH
						</div>
						<div className='item-text'>Campaign balance</div>
						<p className='mt-4 p-text'>The balance is how much money this campaign has left to spend.</p>
					</div>
				</div>
				<div className='flex flex-col sm:flex-row gap-1 w-full mt-8 text-black'>
					<div className='flex flex-col'>
						<label htmlFor='contribution' className='block mb-1 text-lg font-medium text-gray-700'>
							Contribution Amount
						</label>
						<div className='flex'>
							<input
								{...register('contribution', {
									required: 'Contribution amount is required.',
									valueAsNumber: true,
									validate: (value) => {
										if (value || value === 0) return Number.isInteger(value) && value >= campaign.minimumContribution;
									},
								})}
								id='contribution'
								type='number'
								min={campaign.minimumContribution}
								placeholder={campaign.minimumContribution.toString()}
								className={
									errors.contribution
										? 'bg-red-100 modal-input rounded-r-none  placeholder-red-400 review-input'
										: 'review-no-errors review-input rounded-r-none'
								}
							/>
							<div className='flex items-center px-2 modal-input bg-slate-500 text-white rounded-l-none'>WEI</div>
						</div>

						{errors.contribution?.type === 'required' && <div className='text-xs text-red-500'>{errors.contribution.message}</div>}
						{errors.contribution?.type === 'validate' && (
							<div className='text-xs text-red-500'>
								Contribution amount must be a whole number greater than {campaign.minimumContribution.toString()}
							</div>
						)}
						<div className='flex justify-center items-center'>
							<button
								className='btn-standard h-16 w-full pt-0 text-2xl text-center'
								onClick={handleSubmit((data) => {
									createTransactionAsync(data);
									setOpen(true);
								})}
							>
								Contribute!!
							</button>
						</div>
					</div>
					<div className='flex items-end sm:pl-4'>
						<Link
							className='btn-standard h-16 w-full flex items-center bg-black pt-0 text-2xl text-center'
							to={`${PathName.Campaign}/${campaign.address.toLowerCase()}/requests`}
						>
							View Requests
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

SelectedCampaign.displayName = 'SelectedCampaign';
SelectedCampaign.whyDidYouRender = false;
