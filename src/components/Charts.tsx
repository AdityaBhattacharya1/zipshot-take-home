import { PieChart, BarChart, LineChart } from '@mantine/charts'

type UserData = {
	sessionLength: number
	lastLoggedInDate: Date
	username: string
}

interface Props {
	userData: UserData[]
}

const DataVisualisation: React.FC<Props> = ({ userData }) => {
	const sessionLengths = userData.map((user) => user.sessionLength)
	const lastLoggedInDates = userData.map((user) => user.lastLoggedInDate)

	// Prepare data for bar chart
	const sessionLengthByUser = userData.map((user) => ({
		username: user.username,
		sessionLength: user.sessionLength,
	}))

	// Prepare data for pie chart
	const totalSessions = sessionLengths.length
	const sessionLengthCategories = ['Short', 'Medium', 'Long']
	const sessionLengthCounts = [0, 0, 0]
	const colors = ['indigo.6', 'yellow.6', 'teal.6']
	sessionLengths.forEach((sessionLength) => {
		if (sessionLength < 10) {
			sessionLengthCounts[0]++
		} else if (sessionLength >= 10 && sessionLength < 20) {
			sessionLengthCounts[1]++
		} else {
			sessionLengthCounts[2]++
		}
	})

	const pieChartData = sessionLengthCategories.map((category, index) => ({
		name: category,
		value: (sessionLengthCounts[index] / totalSessions) * 100,
		color: colors[index],
	}))

	const lastLoggedInDatesData = lastLoggedInDates.map((date: any, index) => ({
		date: date ? date.toDate().toString().slice(0, 10) : '',
		sessionLength: sessionLengths[index],
	}))

	const groupedData: {
		[key: string]: { date: string; sessionLength: number }[]
	} = lastLoggedInDatesData.reduce(
		(
			acc: { [key: string]: { date: string; sessionLength: number }[] },
			obj
		) => {
			const dateKey = obj.date
			if (!acc[dateKey]) {
				acc[dateKey] = []
			}
			acc[dateKey].push({
				date: obj.date,
				sessionLength: obj.sessionLength,
			})
			return acc
		},
		{}
	)

	console.log('group', groupedData)

	const lineChartData = Object.keys(groupedData)
		.map((date) => ({
			date,
			sessionLength: groupedData[date].reduce(
				(total, obj) => total + obj.sessionLength,
				0
			),
		}))
		.flat()
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
	console.log('line', lineChartData)

	return (
		<div>
			<h2>Pie Chart of Session Length Categories</h2>
			<PieChart
				h={300}
				withLabelsLine
				labelsPosition="outside"
				labelsType="value"
				withLabels
				data={pieChartData}
				withTooltip
			/>
			<h2>Line Chart of Session Length Over Time</h2>
			<LineChart
				h={300}
				w={700}
				data={lineChartData}
				series={[{ name: 'sessionLength', color: 'indigo.6' }]}
				dataKey=""
				xAxisLabel="Dates"
				yAxisLabel="Session Length"
			/>

			<h2>Bar Chart of Session Length by User</h2>
			<BarChart
				h={300}
				data={sessionLengthByUser}
				dataKey="username"
				series={[{ name: 'sessionLength', color: 'teal.6' }]}
				type="default"
			/>
		</div>
	)
}

export default DataVisualisation
