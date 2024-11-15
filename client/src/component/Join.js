import { useState, useEffect, useContext } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Socket } from '../context/Socket';

export default function Join({ enterFunc, setRm }){
    const { socket } = useContext(Socket);
    const [ input, setInput ] = useState({room : "", name : ""});

    const sendMessage = () => {
        socket.emit("join_room", input);
        console.log("emitted");
    };

    useEffect(() => {
        socket.on('join_room', e => {
            console.log(e);
            if(e.status === 200) {
                console.log("Success");
                setRm(e.isRoomMaster);
                console.log(e.isRoomMaster);
                //sessionStorage.setItem('isRoomMaster', JSON.stringify(true));
                enterFunc(e.room);
            }
        })
    }, [socket]);

    return (
        <div className="App">
            <div className="block">
                <input onChange={e => setInput(() => Object({...input, room : e.target.value})) }/>
                <input onChange={e => setInput(() => Object({...input, name : e.target.value})) }/>
                <button style={{width : "100px", height : "40px", fontSize : "20px"}} onClick={sendMessage}> BTN </button>
            </div>
        </div>
    );
};