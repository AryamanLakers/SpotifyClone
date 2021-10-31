import React, { useEffect } from 'react'
import {Container} from "react-bootstrap"
import backgroundvideo from "./sheckWes.mp4"
import altbackgroundvideo from "./altvideo.mp4"

import photo from "/home/saiyans/web development/spotify_clone/src/pexels-karina-zhukovskaya-7260262.jpg"

function Login() {
    const client_id="8f978cfe992340068e03703ef7f053c2"
    const auth_url="https://accounts.spotify.com/authorize?"
    const scope="streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
    const params = {
        client_id: client_id,
        response_type: 'code',
        redirect_uri: "http://localhost:3000",
        scope: scope
    }
    const queryString = new URLSearchParams(params).toString();
    const auth=auth_url+queryString

  
    return (
        
        <Container style={{minHeight:"100vh"}}className="outerbox LoginPage d-flex justify-content-center align-items-center">
            <video className="video" autoPlay loop muted >
                <source src={backgroundvideo} type="video/mp4"></source>
                <source src={altbackgroundvideo} type="video/mp4"></source>
                Your browser does not support the video tag.
            </video> 
            <a className="button" href={auth}>Login</a>
        </Container>
    )
}

export default Login
