import { TableInstance } from 'react-table';

interface TableProps {
	tableInstance: TableInstance;
}
export const Table: React.FC<TableProps> = ({ tableInstance }) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th {...column.getHeaderProps()}>{column.render('Header')}</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map((cell) => {
								return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
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
