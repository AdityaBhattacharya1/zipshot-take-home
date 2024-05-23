import { useNavigate } from 'react-router-dom'
import { auth, googleProvider, db } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithPopup } from 'firebase/auth'
import {
	doc,
	Timestamp,
	setDoc,
	getDoc,
	runTransaction,
} from 'firebase/firestore'

const Login = () => {
	const [_] = useAuthState(auth)
	const navigate = useNavigate()
	const signInWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider)
			const userCreds = result.user

			if (userCreds) {
				const userRef = doc(db, 'users', userCreds.uid)
				const docSnapshot = await getDoc(userRef)
				let data: any = docSnapshot.data()

				if (!docSnapshot.exists()) {
					await setDoc(userRef, {
						username: userCreds.displayName,
						lastLoggedIn: Timestamp.fromDate(new Date()),
						email: userCreds.email,
						sessionLength: 0,
						loginCount: 1,
						dateOfCreation: Timestamp.fromDate(new Date()),
					})
				} else {
					try {
						await runTransaction(db, async (transaction) => {
							const newLoginCount = data.loginCount + 1
							transaction.update(userRef, {
								lastLoggedIn: Timestamp.fromDate(new Date()),
								loginCount: newLoginCount,
							})
						})
						console.log('Transaction successfully committed!')
					} catch (e) {
						console.log('Transaction failed: ', e)
					}
				}
				navigate('/home')
			} else {
				console.error('Error: User credential is null')
			}
		} catch (error) {
			console.error('Error signing in with Google:', error)
		}
	}

	return (
		<div>
			<button onClick={signInWithGoogle}>Login with Google</button>
		</div>
	)
}

export default Login
