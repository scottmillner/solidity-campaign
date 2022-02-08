import { XIcon } from '@heroicons/react/outline';
import { Dispatch, SetStateAction } from 'react';

interface CloseModalIconProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CloseModalIcon: React.FC<CloseModalIconProps> = ({ setOpen }) => {
	return (
		<div className='absolute top-0 left-0 pt-2'>
			<button
				type='button'
				className='ml-1 flex items-center justify-center h-6 w-6 md:h-10 md:w-10 bg-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
				onClick={() => setOpen(false)}
			>
				<XIcon className='h-4 w-4 md:h-6 md:w-6 text-black' aria-hidden='true' />
			</button>
		</div>
	);
};

CloseModalIcon.displayName = 'CloseModalIcon';
CloseModalIcon.whyDidYouRender = false;
