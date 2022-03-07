import { TableInstance } from 'react-table';
import { createUseStyles } from 'react-jss';
import { classNames } from '../utils';

const useStyles = createUseStyles({
	table: {
		'& > thead > tr > th:first-child': {
			borderTopLeftRadius: '5px',
		},
		'& > thead > tr > th:last-child': {
			borderTopRightRadius: '5px',
		},
		'& > tbody > tr:last-child > td:first-child': {
			borderBottomLeftRadius: '5px',
		},
		'& > tbody > tr:last-child > td:last-child': {
			borderBottomRightRadius: '5px',
		},
	},
});

interface TableProps {
	tableInstance: TableInstance;
}
export const Table: React.FC<TableProps> = ({ tableInstance }) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

	const classes = useStyles();

	return (
		<table {...getTableProps()} className={classNames(classes.table, 'w-full')}>
			<thead className='bg-light-aqua text-slate-600 text-justify h-16'>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th {...column.getHeaderProps()} className='pl-4'>
								{column.render('Header')}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()} className='bg-aqua text-white divide-y'>
				{rows.map((row) => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()} className='h-16'>
							{row.cells.map((cell) => {
								return (
									<td {...cell.getCellProps()} className='pl-4'>
										{cell.render('Cell')}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

Table.displayName = 'Table';
Table.whyDidYouRender = false;
