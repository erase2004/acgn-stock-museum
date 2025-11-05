import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBJFPJ4Xjr1Z_96N7rw0DcQKao4eKwpIbY',
  authDomain: 'acgn-museum.firebaseapp.com',
  projectId: 'acgn-museum',
  storageBucket: 'acgn-museum.firebasestorage.app',
  messagingSenderId: '770086167999',
  appId: '1:770086167999:web:1dca68a044109f8963ad0a',
  measurementId: 'G-58NTBC5DHS',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const firestore = getFirestore(app)
