import { useNavigate } from 'react-router-dom'
import { auth, googleProvider, db } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithPopup } from 'firebase/auth'
import { doc, Timestamp, setDoc, getDoc } from 'firebase/firestore'

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

				!docSnapshot.exists()
					? await setDoc(userRef, {
							username: userCreds.displayName,
							lastLoggedIn: Timestamp.fromDate(new Date()),
							email: userCreds.email,
							sessionLength: 0,
					  })
					: await setDoc(
							userRef,
							{
								lastLoggedIn: Timestamp.fromDate(new Date()),
							},
							{ merge: true }
					  )
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
