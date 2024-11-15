import cardset from './cardset.json';
import "../App.css";

export default function Card({ratio = 1, indicator = "A", mark = 'Spade', isBack=false}){
    const getStyle = e => Object.fromEntries(Object.entries(cardset.Quantity[e]).map(e => [e[0],`${e[1]*ratio}px`]));
    
    const toNum = (e)=>{var a = e.split("/").map(e => Number(e)); return a[0]/a[1]};

    return (
        <div className="Card" style={{...getStyle("card"), color : ['Heart', 'Diamond'].includes(mark) && "#FF0000"}}>
            {
                !isBack && Object.values(cardset.style.indicateMark).map((e,i) => {
                    console.log(indicator);
                    return (
                    <div className="indicateMark" key={i} 
                        style={{...getStyle("indicateMark"), position : 'absolute', transform : i && "rotate(180deg)",
                            top : `${!i ? 3*ratio : (88-3-20)*ratio}px`,
                            left : `${!i ? 0 : (63-8.5)*ratio}px`
                        }}>

                        {indicator}
                        <br/>
                        {cardset.marks[mark]}
                    </div>
                    )
                })
            }
            {
                !isBack && cardset.Position.marks[indicator.toString()].map((e,i) => {
                    console.log(i);
                    return (
                    <div className="Marks" key={i}
                        style={{...getStyle("marks"), position : "absolute",
                            top : `${(88*toNum(e.top)-17/2)*ratio}px`, 
                            left : `${(63*toNum(e.left)-17/2)*ratio}px`,
                            transform : toNum(e.top) > 0.5 && "rotate(180deg)",
                            ...(['J', 'Q', 'K'].includes(indicator) ? {
                                width : `${(!i ? 50 : 70) * ratio}px`,
                                height : `${(!i ? 50 : 70) * ratio}px`,
                                top : `${(88*toNum(e.top)-(!i ? 50 : 70)/2)*ratio}px`, 
                                left : `${(63*toNum(e.left)-(!i ? 50 : 70)/2)*ratio}px`,
                                lineHeight : `${(!i ? 45 : 65) * ratio}px`,
                                fontWeight : !i ? "700" : "50",
                                fontSize : `${!i ? 50 * ratio : 70 * ratio}px`,
                                color : i && (['Heart', 'Diamond'].includes(mark) ? "#722" : "#999"),
                                zIndex : i && -1
                            } : {})
                            }}>

                        { !['J', 'Q', 'K'].includes(indicator) ? 
                            cardset.marks[mark] : 
                            !i ? indicator : cardset.marks[mark]}
                    </div>
                    )
                })
            }

            {
                isBack && 
                <div className='BackSide'
                style={{color : "#A0A0A0"}}>
                </div>
            }
        </div>
    )
}