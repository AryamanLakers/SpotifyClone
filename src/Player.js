import React, { useEffect,useState } from 'react'
import "./styles.css"
import SpotifyPlayer from "react-spotify-web-playback"

function Player({trackUri,accessToken,prevSong,setisFinished,setSongState}) {
    const [play,setplay]=useState(false)
    useEffect(()=>{
        setplay(true)
    },[trackUri])
    if(!accessToken) return null
   
    const player1={
        bgColor:"#2B2E4A",
        sliderColor:"#FEFDCA", 
        trackArtistColor: '#F9F7F7',
        sliderTrackBorderRadius:"10px",
        trackNameColor: '#DBE2EF',
        activeColor: 'white',
        sliderHandleColor: '#A1EAFB',
        color: 'white'
    }
   
    return (
        <div >
            
             <SpotifyPlayer
                token={accessToken}
                showSaveIcon
                uris={trackUri?[trackUri]:[]}
                play={play}
                magnifySliderOnHover={true}
                styles={player1}
                callback={state=>{
                    setSongState(state)

                   if(!state.isPlaying){
                        setplay(false)
                   }  
                   if(!state.isplaying && state.previousTracks.length!==0){ 
                        setisFinished(true)
                    }   
                }}
                autoplay={true}
            />  
        </div>
       
        
    )
}

export default Player
