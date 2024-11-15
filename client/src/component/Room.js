import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Socket } from '../context/Socket';
import Chat from './utilOnGame/Chat';
import InGame from './InGame';

export default function Room({room:roomId, isRM}){
    const { socket } = useContext(Socket);
    const [isReady, setIsReady] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [playerNum, setPlayerNum] = useState(null);

    useEffect(() => {
        socket.on('onStart', e => {
            console.log("Started", e);
            setIsStart(e.Started);
            setPlayerNum(e.playerNum);
        });

        socket.on('onReady', e=> {
            console.log("Ready");
            setIsReady(true);
        })
    }, [socket])
    
    return (
        <div className="App">
            <div className="Title">
                { roomId }
            </div>

            { isStart && <InGame room={roomId} playerNum={playerNum}/>}

            <Chat roomId={roomId} isRM={isRM} isStart={isStart} isReady={isReady}/>
        </div>
    );
};