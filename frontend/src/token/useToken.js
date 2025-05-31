import { useState ,useEffect, createContext, useContext} from "react"
import {jwtDecode} from 'jwt-decode'
import {useSnackbar} from '../Components/SnackbarContext'
const AuthContext = createContext()

export function AuthProvider({children}) {
    const {showSnackbar} = useSnackbar()
    
    const removeToken = () => {
        localStorage.removeItem('token') 
        setToken(null)
    }
    const getToken = () =>{
        const token = localStorage.getItem('token')
        if (!token){
            return null
        }
        try{
            const decode = jwtDecode(token)
            const currentTime = Date.now() / 1000
            if (decode.exp < currentTime){
                removeToken()
                showSnackbar('Session is expired')
                return null
            }
            return token
        }
        catch(error){
            showSnackbar('Session is expired')
            removeToken()
            return null
        }
    }
    const [token, setToken] = useState(getToken)
    
    const saveToken = (token) => {
        localStorage.setItem('token',token)
        setToken(token)
    }
    const getUsername = () =>{
        const token = getToken()
        if(!token){
            return null
        }
        try{
            const decoded = jwtDecode(token)
            return decoded.username
        }
        catch(error){
            console.log('error decoding the token',error)
            return null
        }
        
    }
    useEffect(() =>{
        const syncToken = () =>{
            const storedToken = getToken()
            setToken(storedToken)
        }
        
    })
    return (
        <AuthContext.Provider value={{
        setToken: saveToken,
        token,
        removeToken,
        getUsername}}>
        {children}
        </AuthContext.Provider>
    )
}

export function useToken() { 
    return useContext(AuthContext);
}

