import { useState, useEffect } from 'react';
import Join from './Join';
import Room from './Room';

export default function Main(){
    const [entered, setEntered] = useState(false);
    const [isRM, setIsRm] = useState(false);

    return (
        entered ? <Room room={entered} isRM={isRM}/> : <Join enterFunc={setEntered} setRm={setIsRm}/>
    )
}