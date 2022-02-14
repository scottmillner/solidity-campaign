import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ContentState, Receipt } from '../../types';
import { CloseModalIcon } from './CloseModalIcon';
import { useForm } from 'react-hook-form';
import { Spinner } from './Spinner';
import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';
import { classNames } from '../../utils';

interface CreateFormProps {
	web3: Web3 | undefined;
	cloneFactoryContract: Contract | undefined;
	userAccount: string | undefined;
	setOpen: Dispatch<SetStateAction<boolean>>;
}
export const CreateForm: React.FC<CreateFormProps> = ({ web3, cloneFactoryContract, userAccount, setOpen }) => {
	const [contentState, setContentState] = useState<string>(ContentState.Review);
	const [formData, setFormData] = useState<FormData>({ minimumContribution: 1 });

	interface FormData {
		minimumContribution: number;
	}
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<FormData>({ mode: 'onBlur' });

	const createTransactionAsync: (data: FormData) => void = async (data) => {
		// Review
		if (isValid && contentState === ContentState.Review) {
			setContentState(ContentState.Confirm);
			setFormData({ minimumContribution: data.minimumContribution });
		}

		// Confirm
		if (isValid && contentState === ContentState.Confirm) {
			setContentState(ContentState.Pending);
		}

		// Pending
		if (isValid && contentState === ContentState.Pending) {
			try {
				if (web3) {
					const receipt: Receipt = await cloneFactoryContract?.methods
						.createCampaign(formData.minimumContribution, userAccount as string)
						.send({ from: userAccount });
					if (receipt?.status) setContentState(ContentState.Complete);
				}
			} catch (error) {
				setOpen(false);
			}
		}
	};

	// Create transaction when in pending state
	useEffect(() => {
		if (contentState === ContentState.Pending) createTransactionAsync(formData);
	}, [contentState]);

	return (
		<div className='flex flex-col gap-1 w-full min-w-21 max-w-32 sm:min-w-26 bg-white text-black px-6 py-8 md:px-16 border-transparent rounded-5'>
			<CloseModalIcon setOpen={setOpen} />
			{contentState === ContentState.Review ? (
				<div className='modal-input-spacing px-0'>
					<label htmlFor='minimumContribution' className='block mb-1 text-lg font-medium text-gray-700'>
						Minimum Contribution
					</label>
					<div className='flex'>
						<input
							{...register('minimumContribution', {
								required: 'Minimum Contribution is required',
								valueAsNumber: true,
								validate: (value) => {
									if (value || value === 0) return Number.isInteger(value) && value > 0;
								},
							})}
							id='minimumContribution'
							type='number'
							placeholder='1'
							className={
								errors.minimumContribution
									? 'bg-red-100 modal-input rounded-r-none  placeholder-red-400 review-input'
									: 'review-no-errors review-input rounded-r-none'
							}
						/>
						<div className='flex items-center px-2 modal-input bg-slate-500 text-white rounded-l-none'>WEI</div>
					</div>

					{errors.minimumContribution?.type === 'required' && (
						<div className='text-xs text-red-500'>{errors.minimumContribution.message}</div>
					)}
					{errors.minimumContribution?.type === 'validate' && (
						<div className='text-xs text-red-500'>Contribution must be a whole number greater than 0</div>
					)}
				</div>
			) : null}
			{contentState === ContentState.Confirm ? (
				<div className='flex flex-col w-full items-center mb-4'>
					<p className='text-slate-800 text-xl'>Review the contribution amount and confirm to create the campaign.</p>
					<div className='w-full confirm-div'>
						<p className='font-medium'>Minimum Contribution:</p>
						<p className='ml-4 font-medium'>{formData.minimumContribution} WEI</p>
					</div>
				</div>
			) : null}
			{contentState === ContentState.Pending || contentState === ContentState.Complete ? (
				<div className={classNames(contentState === ContentState.Pending ? 'mb-4' : '', 'flex flex-col w-full items-center')}>
					<p className={classNames(contentState === ContentState.Pending ? 'mb-8' : '', 'text-center text-xl')}>
						{contentState === ContentState.Pending ? 'Your transaction is pending.' : 'Your campaign was created successfully!'}
					</p>
					{contentState === ContentState.Pending ? <Spinner /> : null}
				</div>
			) : null}
			{contentState === ContentState.Review || contentState === ContentState.Confirm ? (
				<div className='flex justify-center items-center'>
					<button
						className='btn-standard h-16 w-full pt-0 text-2xl text-center'
						onClick={handleSubmit((data) => createTransactionAsync(data))}
					>
						{contentState === ContentState.Review ? 'Create' : 'Confirm'}
					</button>
				</div>
			) : null}
		</div>
	);
};
