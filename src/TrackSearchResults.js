import React from 'react'
import Imgix from "react-imgix";
import "./styles.css"
function TrackSearchResults({track,choosetrack}) {
    if(!track) return
    function handleplay(){
        choosetrack(track)
    }
    return (
        <div 
        onClick={handleplay} 
        style={{cursor:"pointer"}}
        className="d-flex m-2 align-items-center">
            <Imgix src={track.albumUri} sizes="100vw" />
            <div className="songlist" style={{marginLeft:"2rem"}}>
                <div>{track.title}</div>
                <div style={{fontWeight:"lighter"}}>{track.artist}</div>
            </div>
        
        </div>
    )
}

export default TrackSearchResults
