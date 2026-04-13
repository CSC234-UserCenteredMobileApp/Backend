import { initializeApp, cert, getApps } from 'firebase-admin/app'

// Initialize Firebase Admin SDK
// You must set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        // Replace literal \n with actual newlines in the private key string
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    })
  } else if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    console.warn('Firebase Admin SDK: Credentials missing. Auth will fail unless using dev-token bypass.')
  }
}

export { getApps }
