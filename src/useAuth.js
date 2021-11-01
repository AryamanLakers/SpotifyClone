import React, { useEffect,useState } from 'react'
import axios from 'axios'

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState() 
    

    useEffect(()=>{
        //i have to make a post request to send the code to /login
        
        axios.post("/login",{code,})
            .then(res=>{
                console.log(res)
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)
                window.history.pushState({},null,"/")
            }) 
            .catch((err)=>console.log(err))
    },[code])
    
    
    useEffect(()=>{
        if(!refreshToken || !expiresIn ){return}
        const interval=setInterval(()=>{axios.post("/refresh_token",{refreshToken,})
        .then(res=>{
            setAccessToken(res.data.accessToken)
            setExpiresIn(res.data.expiresIn)
           }) 
        .catch((err)=>console.log(err))},(expiresIn-60)*1000)
        return () => clearInterval(interval)
    },[refreshToken,expiresIn])

    //this is a token that we need to call various api calls
    return accessToken
    
}
