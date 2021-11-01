import React, { useState, useEffect } from 'react';

function NewPlayer({accessToken,trackUri,nextSong}) {
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(trackUri);
    const [deviceid,setDeviceid]=useState();
    const [currentAccesstoken,setaccessToken]=useState()
    
   
    
    
    useEffect(() => {
            if(!accessToken) return 
           
                
                const script = document.createElement("script");
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.async = true;
            
                document.body.appendChild(script);
            
                window.onSpotifyWebPlaybackSDKReady = () => {
            
                    const player = new window.Spotify.Player({
                        name: 'Web Playback SDK',
                        getOAuthToken: cb => { cb(accessToken); },
                        volume: 0.5
                    });
                    
                    setPlayer(player);
                    player?console.log(player):console.log("cooking!!!")
                    player.addListener('ready', ({ device_id }) => {
                        console.log('Ready with Device ID', device_id);
                    });
                    
                    player.addListener('not_ready', ({ device_id }) => {
                        console.log('Device ID has gone offline', device_id);
                    });
                    player.getCurrentState().then(state => {
                        if (!state) {
                          console.error('User is not playing music through the Web Playback SDK');
                          return;
                        }
                      
                        var current_track = state.track_window.current_track;
                        var next_track = state.track_window.next_tracks[0];
                      
                        console.log('Currently Playing', current_track);
                        console.log('Playing Next', next_track);
                      });
            
                    player.connect();
            
                };
           
    
    }, [accessToken]);
    
    // useEffect(()=>{
    //     if(!deviceid) return console.log("device id not ready yet")
    //     console.log(trackUri)
    //     fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceid}`, {
    //         method: 'PUT',
    //         body: JSON.stringify({ uris: [trackUri] }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${accessToken}`
    //         },
    //     }).then((res)=>res.json())
    //       .then((data)=>console.log(data))
    //       .catch((err)=>console.log(err))
    // },[current_track])
    
    
    return (
        <div>
            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
            &lt;&lt;
            </button>

            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                { is_paused ? "PLAY" : "PAUSE" }
            </button>

            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                &gt;&gt;
            </button>
        </div>
    )
}

export default NewPlayer
