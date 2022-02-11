import { Dispatch, SetStateAction, useState } from 'react';
import { ContentState } from '../../types';
import { CloseModalIcon } from './CloseModalIcon';
import { useForm } from 'react-hook-form';

interface CreateFormProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
}
export const CreateForm: React.FC<CreateFormProps> = ({ setOpen }) => {
	const [contentState, setContentState] = useState<string>(ContentState.Review);

	interface FormData {
		minimumContribution: number;
	}
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<FormData>({ mode: 'onBlur' });

	const createTransactionAsync: (data: FormData) => void = async (data) => {};

	return (
		<div className='flex flex-col gap-1 bg-white text-black px-6 py-8 md:px-16 border-transparent rounded-5'>
			<CloseModalIcon setOpen={setOpen} />
			{contentState === ContentState.Review ? (
				<div className='modal-input-spacing px-0'>
					<label htmlFor='minimumContribution' className='block mb-1 text-lg font-medium text-gray-700'>
						Minimum Contribution (ETH) *
					</label>
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
							errors.minimumContribution ? 'bg-red-100 btn-modal placeholder-red-400 review-input' : 'review-no-errors review-input'
						}
					/>
					{errors.minimumContribution?.type === 'required' && (
						<div className='text-xs text-red-500'>{errors.minimumContribution.message}</div>
					)}
					{errors.minimumContribution?.type === 'validate' && (
						<div className='text-xs text-red-500'>Contribution must be a whole number</div>
					)}
				</div>
			) : null}
			{contentState === ContentState.Pending ? (
				<div className='flex flex-col w-full items-center mb-4'>
					<p className='w-4/6 text-center text-xl mb-8'>Your transaction is pending.</p>
				</div>
			) : null}
			{contentState === ContentState.Review ? (
				<div className='flex justify-center items-center'>
					<button
						className='btn-standard h-16 w-full pt-0 text-2xl text-center'
						onClick={handleSubmit((data) => createTransactionAsync(data))}
					>
						Create
					</button>
				</div>
			) : null}
		</div>
	);
};
