import { Table } from '@mantine/core'

const DataTable = ({
	headers,
	children,
}: {
	headers: string[]
	children: any
}) => {
	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					{headers.map((header: string, idx: number) => (
						<Table.Th key={idx}>{header}</Table.Th>
					))}
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{children}</Table.Tbody>
		</Table>
	)
}

export default DataTable
