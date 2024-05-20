// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyABXEdfGNIQHaWGtaByiOHgnqBie0CfBA0',
	authDomain: 'zipshot-th.firebaseapp.com',
	projectId: 'zipshot-th',
	storageBucket: 'zipshot-th.appspot.com',
	messagingSenderId: '459695673240',
	appId: '1:459695673240:web:4bf131139eb234b19ce5ed',
	measurementId: 'G-563VYQDC92',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
