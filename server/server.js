const express=require('express')
const bodyParser = require('body-parser')
const cors=require('cors')
const lyricsFinder = require('lyrics-finder');
const app = express() 
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const Spotifywebapi=require('spotify-web-api-node')
app.post('/refresh_token',(req, res)=>{
    const refreshToken = req.body.refreshToken
    
    const spotifyApi=new Spotifywebapi({
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        redirectUri:"https://spotify-mini-26.herokuapp.com",
        refreshToken,
    })
    spotifyApi.refreshAccessToken().then(
        (data)=> {
           res.json({
             accessToken: data.body.accessToken,
             expiresIn:data.body.expiresIn
         })
        // Save the access token so that it's used in future calls
          //spotifyApi.setAccessToken(data.body['access_token']);
        }
      ).catch((err)=>{console.log(`error in refreshing the token:${err}`)})
})



app.post('/login',(req,res)=>{
    
    const code=req.body.code
    
    const spotifyApi=new Spotifywebapi({
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        redirectUri:"https://spotify-mini-26.herokuapp.com",

    })
    spotifyApi.authorizationCodeGrant(code)
        .then((data)=>{
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(400)
        })

})

app.get("/lyrics",async (request,res)=>{
    
    const data=request.query
    const lyrics=await lyricsFinder(data.artist, data.title) || "Not Found!";
    res.json({lyrics})
})

app.listen(process.env.PORT||3001,()=>{
    console.log("The server is up and running")
})
