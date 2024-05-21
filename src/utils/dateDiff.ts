export const getDifferenceBetweenDates = (
	dateStr1: string,
	dateStr2: string
): number => {
	const parseDate = (dateStr: string): Date => {
		return new Date(dateStr)
	}

	const date1 = parseDate(dateStr1)
	const date2 = parseDate(dateStr2)

	// Calculate the difference in milliseconds
	const differenceInMs = date1.getTime() - date2.getTime()

	const msInSecond = 1000
	const msInMinute = msInSecond * 60
	const msInHour = msInMinute * 60
	const msInDay = msInHour * 24

	const days = Math.floor(differenceInMs / msInDay)

	return days
}

// Example usage
const dateStr1 = 'Wed May 22 2024 02:27:45 GMT+0530 (India Standard Time)'
const dateStr2 = 'Mon May 20 2024 13:00:00 GMT+0530 (India Standard Time)'
console.log(getDifferenceBetweenDates(dateStr1, dateStr2))
