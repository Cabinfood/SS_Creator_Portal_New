import React from 'react';
import JWPlayer from '@jwplayer/jwplayer-react';
// https://www.npmjs.com/package/@jwplayer/jwplayer-react

class PlayerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.players = {};
        this.onBeforePlay = this.onBeforePlay.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.playerMountedCallback = this.playerMountedCallback.bind(this);
        this.playerUnmountingCallback = this.playerUnmountingCallback.bind(this);        
        console.log("props: ", props)
    } 

    
    // Registers players as they mount
    playerMountedCallback({ player, id }) {
        this.players[id] = player;
    }

    // Nulls registered players as they unmount
    playerUnmountingCallback({ id }) {
        this.players[id] = null;
    }

    // Prevent multiple players from playing simultaneously
    onBeforePlay(event) {
        Object.keys(this.players).forEach(playerId => {
        const player = this.players[playerId];
        const isPlaying = player.getState() === 'playing';
        if (isPlaying) {
            player.pause();
        }
        });
    }
    
    // Put teal colored outline on currently playing player, remove it from all other players.
    onPlay(event) {
        Object.keys(this.players).forEach(playerId => {
            const player = this.players[playerId];
            const container = player.getContainer();
            if (player.getState() === 'playing') {
                // container.style.border = '15px solid #00FFFF';
            } else {
                container.style.border = '';
            }
        });
    }

    render() {
        // Re-usable defaults to use between multiple players.
        const configDefaults = { 
            // width: 320, height: 180 
            autostart: this.props.autostart || false,
            // mute: this.props.muted || true,
            // volume: this.props.volume || 0
        };

        return (
            <div className='players-container'>
                <JWPlayer
                    config={configDefaults}
                    onBeforePlay={this.onBeforePlay}
                    onPlay={this.onPlay}
                    didMountCallback={this.playerMountedCallback}
                    willUnmountCallback={this.playerUnmountingCallback}
                    // file = {`https://j3n99icvviobj.vcdn.cloud/contents/39c95e28-51ac-43b4-b3a7-b8e622a714e2.mp4`}
                    file = {`${this.props.source}#t=0.001`}
                    library= {
                        this.props.mode === 1 
                        ? 'https://cdn.jwplayer.com/libraries/qvRrxvwy.js'
                        : 'https://cdn.jwplayer.com/libraries/hnefsvuR.js'
                    }
                    
                />
            
            </div>
        );
    }
}
export default PlayerContainer;