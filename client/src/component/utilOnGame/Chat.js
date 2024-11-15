import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Socket } from '../../context/Socket';

export default function Chat({roomId, isRM, isStart, isReady}){
    const { socket } = useContext(Socket);
    const [chats, setChats] = useState([]);
    const [ input, setInput ] = useState("");
    const [isMin, setIsMin] = useState(false);
    
    const scrollChat = useRef(null);

    const Msg = () => {
        socket.emit("chat", {room : roomId, content : input});
        setInput("");
    };

    const toStartGame = () => {
        socket.emit('start', roomId);
    }

    const toReady = () => {
        socket.emit('ready', roomId);
    }

    useEffect(() => {
        socket.on('chats', e => {
            console.log(e);
            setChats([...chats, e]);
            scrollChat.current && scrollChat.current.scrollIntoView({ behavior: 'smooth' });
            
        });    
    }, [socket, chats]);


    return (
        <>

            <div className="ChatBox" style = {!isStart ? {} : {width : "20%", height : !isMin ? "200px" : "20px", position : "absolute", top : "100%", transform : `translate(0%, -${120+170*isMin}%`}}>

                {!isStart ? 
                    (isRM ? 
                        <button className="strdBtn" onClick={toStartGame}>start</button>
                        : <button className="strdBtn" style={{backgroundColor : isReady && "#55FF88"}} onClick={toReady}>ready</button>)
                    : <button className="minmaxBtn" onClick={() => setIsMin(!isMin)}>-</button>
                }

                {chats.map((e,i) => {
                    return (
                    <div className="chat" key={i}>
                        {`${e.name} : ${e.content}`} 
                    </div>
                    )
                })}

                <div ref={scrollChat} style={{height : "0px"}}/>    
            </div>

            <div className="inputBox" style={!isStart ? {} : {width : "20%", height : "40px", position : "absolute", top : "100%", transform : "translate(0%, -100%)"}}>
                <input style={!isStart ? {} : {width : "70%"}} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && Msg()}/>
                <button style={!isStart ? {} : {width : "20%"}} onClick={Msg}> B </button>
            </div>
        </>
    )
}