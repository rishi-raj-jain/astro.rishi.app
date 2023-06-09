import admin from 'firebase-admin'
import { fireConfig } from './firebaseConfig'

try {
  admin.initializeApp({
    credential: admin.credential.cert(fireConfig),
  })
} catch (e) {}

export default admin
