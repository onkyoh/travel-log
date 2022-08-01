import { useState } from "react"
import {db, auth} from "../firebase-config"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { setDoc, doc} from 'firebase/firestore'

const Login = ({setCurrentUser}) => {

    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [needAccount, setNeedAccount] = useState(true)
    const [error, setError] = useState("")

    const register = async (e) => {
        e.preventDefault()
        try {
            const cred = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            console.log(cred)
            const createUser = async () => {
                await setDoc(doc(db, "users", cred.user.uid), {contacts: [], trips: [], markers: [], email: registerEmail})
                console.log('created')
            }
            createUser()
            setCurrentUser(cred.user.uid)
            console.log(cred.user.uid)
        }
        catch (error) {
            setError(error.message)
            console.log(error.message)
        }

     
    }

    const login = async (e) => {
        e.preventDefault()
        try {
            const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            setCurrentUser(cred.user.uid)
            console.log('logged in')
        }
        catch (error) {
            setError(error.message)
            console.log(error.message)
        }
  
    }

    const handleNeedAccount = () => {
        setNeedAccount(!needAccount)
        setRegisterEmail("")
        setRegisterPassword("")
        setLoginEmail("")
        setLoginPassword("")
        setError("")
    }

  return (
    <div className='login'>
        <div className="form_container">
        {needAccount ?
        <form>
            <h2>Register</h2>
            <span className="error" style={!error ? {display: "none"} : {}}>{error}</span>
            <label htmlFor="email_register">Email</label>
            <input type="email" id="email_register" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)}/>
            <label htmlFor="password_register">Password</label>
            <input type="password" id="password_register" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)}/>
            <button onClick={(e) => register(e)}>REGISTER</button>
            <p>Already have an account?<span onClick={handleNeedAccount}> Click Here.</span></p>
        </form>
        :
        <form>
            <h2>Login</h2>
            <span className="error" style={!error ? {display: "none"} : {}}>{error}</span>
            <label htmlFor="email_login">Email</label>
            <input type="email" id="email_login" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/>
            <label htmlFor="password_login">Password</label>
            <input type="password" id="password_login" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
            <button onClick={(e) => login(e)}>LOGIN</button>
            <p>Need an account?<span onClick={handleNeedAccount}> Click Here.</span></p>
        </form>
        }
       
        </div>
    </div>
  )
}

export default Login