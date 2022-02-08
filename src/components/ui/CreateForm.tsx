import { Dispatch, SetStateAction } from 'react';
import { CloseModalIcon } from './CloseModalIcon';

interface CreateFormProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
}
export const CreateForm: React.FC<CreateFormProps> = ({ setOpen }) => {
	return (
		<div className='flex flex-col gap-1 bg-white text-black p-6 text-xl md:p-16 md:text-3xl border-transparent rounded-5'>
			<CloseModalIcon setOpen={setOpen} />
			<div className='flex justify-center'>
				<p className='bg-white border-transparent ml-2 pt-0 text-center'>Create</p>
			</div>
		</div>
	);
};
