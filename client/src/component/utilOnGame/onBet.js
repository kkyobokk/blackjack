import { useState, useEffect, useContext} from 'react'
import { Socket } from '../../context/Socket';

export default function OnBet({roomId}){
    const [bet, setBet] = useState("");
    const [accomplish, setAccomplish] = useState(false);
    const { socket } = useContext(Socket);
    
    const decideBet = () => {
        if( Number.isNaN(bet) ){

        }
        else if( bet < 500 ){

        }
        else {
            socket.emit("bet", {room : roomId, bet : bet});
            console.log("Bet", bet);
        }
    }

    useEffect(() => {
        socket.on("accomplishBet", (e) => {
            setAccomplish(e);
            if(!e){
                
            }
        })
    }, [socket]);

    return (
        <div className="Bet">
            {!accomplish ? <label style={{display : "flex", flexDirection:"column", gap : "2vw"}}>
                <div>Enter Your Bet</div>
                <input className="betInput" value={bet} 
                onChange={e => e.target.value==="" ? setBet("") : !Number.isNaN(Number(e.target.value)) && setBet(Number(e.target.value))} 
                onKeyDown={e => e.key === "Enter" && decideBet()}
                placeholder='Enter your Bet Amount'/>
            </label>
            :
            <div>
                You Bet {bet}$
                <br/>
                Wait for who haven't bet
            </div>
            }
        </div>
    )
}