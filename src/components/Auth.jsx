import React from 'react'
import { auth, provider  } from '../firebase-config'
import { signInWithPopup } from 'firebase/auth'

import Cookies from 'universal-cookie'
const cookies = new Cookies()


const Auth = (props) => {
  const { setIsAuth } = props

  const SignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider) // returns inside result a bunch of user info from google login
      cookies.set("auth-token", result.user.refreshToken) // takes refreshToken and saves it as a cookie (stays after refresh)
      setIsAuth(true)
    } catch(error){
      console.error(error)
    }
  }


  return (
    <div className='sign-in-container flex flex-col items-center my-40'>
      <h1>Chuck Chat</h1>
      <p className='mt-10 mb-3 text-xl'>Sign in with Google to continue</p>
      <button className='sign-in-btn' onClick={SignInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

export default Auth