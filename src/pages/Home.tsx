import React, { useEffect, useState, useMemo } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, app } from '../config/firebase'
import {
	collection,
	getFirestore,
	setDoc,
	doc,
	where,
	query,
	getDocs,
	QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useIdleTimer } from 'react-idle-timer/legacy'
import { useNavigate } from 'react-router-dom'

import { Button, Table } from '@mantine/core'
import DataTable from '../components/Table'
import DataVisualisation from '../components/Charts'

const Home: React.FC = () => {
	const [elapsed, setElapsed] = useState<number>(0)
	const [yesterdaySignedInUsers, setYesterdaySignedInUsers] = useState<any>()
	const [user] = useAuthState(auth)
	const navigate = useNavigate()
	const [usersList, usersListLoading, usersListError] = useCollection(
		collection(getFirestore(app), 'users'),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	)
	const startDate = useMemo(() => new Date(Date.now() - 864e5), [])
	startDate.setHours(0, 0, 0, 0)
	const endDate = useMemo(() => new Date(Date.now() - 864e5), [])
	endDate.setHours(23, 59, 59, 999)
	const userDataArr: any[] = []
	const onAction = () => {}
	const { getElapsedTime } = useIdleTimer({
		onAction,
		timeout: 10_000,
		throttle: 500,
	})

	useEffect(() => {
		const interval = setInterval(() => {
			// getElapsedTime returns elapsed time in ms. converting it to seconds
			setElapsed(Math.ceil(getElapsedTime() / 1000))
		}, 500)

		return () => {
			clearInterval(interval)
		}
	}, [user, elapsed, getElapsedTime])

	useEffect(() => {
		const fetchYesterdayUsers = async () => {
			const yesterdaySignedInUsersQuery = query(
				collection(db, 'users'),
				where('lastLoggedIn', '>=', startDate),
				where('lastLoggedIn', '<=', endDate)
			)
			const result = await getDocs(yesterdaySignedInUsersQuery)
			setYesterdaySignedInUsers(result)
		}

		fetchYesterdayUsers()
	}, [endDate, startDate])

	const handleLogout = async () => {
		if (user) {
			const userRef = doc(db, 'users', user.uid)
			await setDoc(
				userRef,
				{
					sessionLength: elapsed,
				},
				{ merge: true }
			)
		}

		auth.signOut()
		navigate('/')
	}
	return (
		<div>
			{usersListError && (
				<strong>Error: {JSON.stringify(usersListError)}</strong>
			)}
			{usersListLoading && <span>Collection: Loading...</span>}
			<DataTable
				headers={[
					'Email',
					'Username',
					'Last Logged In',
					'Login Frequency',
					'Session Length',
				]}
			>
				{usersList && (
					<>
						{usersList.docs.map((doc) => {
							const data = doc.data()
							// only get the latest 15 user's data
							userDataArr.push({
								sessionLength: data.sessionLength,
								lastLoggedInDate: data.lastLoggedIn,
								username: data.username,
								email: data.email,
							})

							return (
								<Table.Tr key={doc.id}>
									<Table.Th>{data.email || 'N/A'}</Table.Th>
									<Table.Th>
										{data.username || 'N/A'}
									</Table.Th>
									<Table.Th>
										{doc
											.data()
											.lastLoggedIn.toDate()
											.toLocaleTimeString('en-US') ||
											'N/A'}
									</Table.Th>
									<Table.Th>
										{data.loginFrequency || 'N/A'}
									</Table.Th>
									<Table.Th>
										{data.sessionLength || 'N/A'}
									</Table.Th>
								</Table.Tr>
							)
						})}
					</>
				)}
			</DataTable>
			<h1>Logged In Yesterday</h1>

			<DataTable
				headers={[
					'Email',
					'Username',
					'Last Logged In',
					'Login Frequency',
					'Session Length',
				]}
			>
				{yesterdaySignedInUsers && (
					<>
						{yesterdaySignedInUsers.docs.map(
							(doc: QueryDocumentSnapshot) => {
								const data = doc.data()
								return (
									<Table.Tr key={doc.id}>
										<Table.Th>
											{data.email || 'N/A'}
										</Table.Th>
										<Table.Th>
											{data.username || 'N/A'}
										</Table.Th>
										<Table.Th>
											{doc
												.data()
												.lastLoggedIn.toDate()
												.toLocaleTimeString('en-US') ||
												'N/A'}
										</Table.Th>
										<Table.Th>
											{data.loginFrequency || 'N/A'}
										</Table.Th>
										<Table.Th>
											{data.sessionLength || 'N/A'}
										</Table.Th>
									</Table.Tr>
								)
							}
						)}
					</>
				)}
			</DataTable>
			{userDataArr.length !== 0 && (
				<DataVisualisation
					userData={
						userDataArr.length >= 20
							? userDataArr.slice(0, 21)
							: userDataArr
					}
				/>
			)}
			<Button onClick={handleLogout}>Logout</Button>
		</div>
	)
}

export default Home
