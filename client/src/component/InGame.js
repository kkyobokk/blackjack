import Card from '../util/Card';
import {useState, useEffect, useContext} from 'react';
import { Socket } from '../context/Socket';
import OnBet from './utilOnGame/onBet';
import OnSet from './utilOnGame/OnSet';
import CardTabe from './utilOnGame/CardTabe';

const Util = (roomId) => {
    return {
        onbet : <OnBet roomId={roomId}/>,
        onset : <OnSet roomId={roomId}/>,
        getComp : function(e){ return this[e]!== undefined ? this[e] : null}
    };
}

export default function InGame({room : roomId, playerNum}){
    const {socket} = useContext(Socket);
    const [cardratio, setCardratio] = useState(window.innerWidth/750);
    const [state, setState] = useState("onBet");
    const [cards, setCards] = useState([]);
    const [nowUtil, setNowUtil] = useState(null);

    useEffect(() => {
        socket.on("transState", e => {
            setState(e.State);
        });

        socket.on("Cardset", e => {
            setCards(e);
        })
    }, [socket]);

    useEffect(() => {
        state && setNowUtil(Util[state.toLowerCase()])
    }, [state])

    return (
        <div className="GameBoard">
            <div className="foundation">
                {/*Array.from({length:playerNum}).map((e,i) => <Card key={i} ratio={cardratio}/>)*/}
                <div className="Table">
                    <CardTabe/>
                </div>
            </div>
            <div className="Util">
                {Util(roomId).getComp(state.toLowerCase())}
            </div>
        </div>
    )
}