import {useState, useEffect, useContext} from 'react';
import Card from '../../util/Card';

export default function(){
    
    const [ratio, setRatio] = useState(window.innerWidth/750 * 1.1);

    useEffect(() => {
        const handleResize = () => {
            const p = window.innerWidth/750 * 1.1;
            setRatio(p > 1.4 ? 1.4 : p);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <div className="Deck">
            <Card ratio={ratio} isBack={true}/>
            </div>
        </div>
    )
}