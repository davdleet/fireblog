import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context'
import { useAuthState } from 'react-firebase-hooks/auth'
import { UseUserData } from '../lib/hooks'

function MyApp({ Component, pageProps }) {
  const userData = UseUserData();
  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
