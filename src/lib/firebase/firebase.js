import { fireConfig } from './firebaseConfig'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const app = initializeApp(fireConfig)
const db = getFirestore(app)

export default db
