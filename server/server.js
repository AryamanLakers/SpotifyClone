const express=require('express')
const bodyParser = require('body-parser')
const cors=require('cors')
const lyricsFinder = require('lyrics-finder');
const app = express() 


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const Spotifywebapi=require('spotify-web-api-node')
app.post('/refresh_token',(req, res)=>{
    const refreshToken = req.body.refreshToken
    
    const spotifyApi=new Spotifywebapi({
        clientId: "8f978cfe992340068e03703ef7f053c2",
        clientSecret: "a9dce3e80d594fc08e99a44bff201a82",
        redirectUri:"http://localhost:3000",
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
        clientId: "8f978cfe992340068e03703ef7f053c2",
        clientSecret: "a9dce3e80d594fc08e99a44bff201a82",
        redirectUri:"http://localhost:3000",
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
app.listen(3001)