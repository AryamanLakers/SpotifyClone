import React, { useEffect, useState } from 'react'
import useAuth from "./useAuth"
import {Container, Form} from "react-bootstrap"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResults from './TrackSearchResults'
import SpotifyPlayer from 'react-spotify-web-playback';
import Player from "./Player"
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CancelIcon from '@mui/icons-material/Cancel';
import "./styles.css"
import { usePalette } from 'react-palette'
import axios from 'axios'
import NotFoundPage from './NotFoundPage'

const spotifyApi=new SpotifyWebApi({
    clientId:"8f978cfe992340068e03703ef7f053c2",
})

function getThePLayer(accessToken){
   if(window.Spotify===null) return
   const player=new window.Spotify.Player({
       name:"Aryaman's Spotify",
       getOAuthToken: cb => { cb(accessToken); },
   });
   player.connect();
   return player
}


function Dashboard({code}) {
    const accessToken=useAuth(code)
    const [search,setSearch]= useState("")
    const [SearchResults,setSearchResults]=useState([])
    const [currentTrack,setCurrentTrack]=useState()
    const [prevSong,setPrevSong]=useState(false)
    const [colordata,setColordata]=useState("")
    const [tempdata,settempdata]=useState("")
    const [songLyrics,setsongLyrics]=useState("")
    const [isPressed,setisPressed]=useState(false)
    const [nextSong,setNextSong]=useState([])
    const [isFinished,setisFinished]=useState(false)
    const [songState,setSongState]=useState()
    const [switchy,setSwitch]=useState(true)
    let player1;
    const photo="https://wallpaperaccess.com/full/781042.jpg"
    
    
    function choosetrack(track){
        setSwitch(true)
        setCurrentTrack(track)
        setColordata(track.largestsize)
        setPrevSong(true)
        setSearch("")
        setsongLyrics("")
        setisPressed(false)
    }
    function GetMeLyrics(){
        isPressed?setisPressed(false):setisPressed(true)
    }

    useEffect(()=>{settempdata(colordata)},[colordata])
    const { data, loading, error } = usePalette(encodeURI(tempdata))
    
    useEffect(()=>{
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        //player1=getThePLayer(accessToken)
        // player1.addListener('ready', ({ device_id }) => {
        //     console.log('Ready with Device ID', device_id);
        //   });
    },[accessToken])
    
    
    //i need a useffect which would update the results whenever searchchanges
    useEffect(()=>{
        
        if(!search) return setSearchResults([])
        if(!accessToken) return console.log("failed")
        console.log(accessToken)
        let cancel=false
        spotifyApi.searchTracks(search,{limit:50})
            .then((res)=>{

                if(cancel) return
                console.log(accessToken)
                setSearchResults(
                    res.body.tracks.items.map((track)=>{
                        const smallestAlbumUri=track.album.images.reduce((smallest,image)=>{
                            if(image.height<smallest.height){
                                return image
                            }
                            return smallest
                        },track.album.images[0])
                        const largestAlbumUri=track.album.images.reduce((largest,image)=>{
                            if(image.height>largest.height){
                                return image
                            }
                            return largest
                        },track.album.images[0])
                        return {
                            artist:track.artists[0].name, 
                            title:track.name,
                            uri:track.uri,
                            albumUri:smallestAlbumUri.url,
                            largestsize:largestAlbumUri.url,
                        }
                    })
                )

            })
            //the problem: we only want to search when we have stopped typing
        return ()=> (cancel=true)
    },[search,accessToken])
    
    useEffect(()=>{
        if(!currentTrack) return 
        axios.get("http://localhost:3001/lyrics",{
            params:{
                title:currentTrack.title,
                artist:currentTrack.artist
            }
        }).then((response)=>{
                //now i will get lyrics
                
                setsongLyrics(response.data.lyrics)
            })
    },[currentTrack])
    //whenver current song changes i will make a new call for this artists
    //and populate my nextTrack array with the results of that partiulat artists

    useEffect(()=>{
        if(!currentTrack) return
        if(!switchy) return
        const currentTrackArtist=currentTrack.artist;
       
        spotifyApi.searchTracks(currentTrackArtist,{limit:20})
            .then((res)=>{
               
                
                setNextSong(
                    res.body.tracks.items.map((track)=>{
                        const smallestAlbumUri=track.album.images.reduce((smallest,image)=>{
                            if(image.height<smallest.height){
                                return image
                            }
                            return smallest
                        },track.album.images[0])
                        const largestAlbumUri=track.album.images.reduce((largest,image)=>{
                            if(image.height>largest.height){
                                return image
                            }
                            return largest
                        },track.album.images[0])
                        return {
                            artist:track.artists[0].name, 
                            title:track.name,
                            uri:track.uri,
                            albumUri:smallestAlbumUri.url,
                            largestsize:largestAlbumUri.url,
                        }
                    })
                )
              setSwitch(false)     
             })
             //return ()=> (cancel=true)
        },[currentTrack])
       
        useEffect(()=>{
            if(!isFinished)  return console.log("error")
            console.log(songState.previousTracks[songState.previousTracks.length-1])
            let num=0
            if(nextSong[0].title===songState.previousTracks[songState.previousTracks.length-1].name) num=1
           setCurrentTrack(nextSong[num])
           setNextSong(nextSong.splice(1))
           setisFinished(false)
        },[isFinished])
        console.log(nextSong)

    return (
        
        <Container className="d-flex justify-content-center align-items-center flex-column py-2 containerClass" 
            style={{height: '100vh',minWidth:"100vw",margin:"0",backgroundImage:`url(${currentTrack?currentTrack.largestsize:photo})`,backgroundPosition: 'center',
            backgroundSize: 'cover', backgroundRepeat: 'no-repeat', transitionProperty: "background-image",
            transitionDuration: "20s",
            transitionTimingFunction: "linear"}}>
            
            <Form.Control 
                type="search"
                placeholder="Enter Song, Artist Name"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="form"
                style={{backgroundColor:"#3D0000",borderColor:`${data.vibrant}`,borderWidth:"2px",borderStyle:"solid"}}
            />
            <div class="cancelItem" onClick={()=>{setSearch("")}}>
                <CancelIcon />
            </div>
            
            
            <div className="flex-grow-1 my-2 search" >
                {SearchResults.map(track => (
                    <TrackSearchResults
                        track={track}
                        key={track.uri}
                        choosetrack={choosetrack}
                        
                    />
                ))}
                {SearchResults.length===0 && isPressed && songLyrics!=="Not Found!" &&(
                <div className="text-center lyricBox" style={{whiteSpace:"pre"}}>
                    {songLyrics}
                </div>
            )}
            
            </div>
            {SearchResults.length===0 && songLyrics==="Not Found!" && isPressed && <NotFoundPage />}
            <div className="lyrics" onClick={GetMeLyrics}>
                <MusicNoteIcon fontSize="large"/>
            </div>
            
            <div class="player">
                {/* how did we manage to pass current track using ternary without : */}
                <Player 
                    accessToken={accessToken} 
                    trackUri={currentTrack?.uri} 
                    prevSong={prevSong}
                    setisFinished={setisFinished}
                    setSongState={setSongState}
                /> 
                
            
            </div>
        </Container>
        
        
    )
}

export default Dashboard
