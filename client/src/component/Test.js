import Card from '../util/Card';

export default function Test() {

    return <div className="App" >
        <div style={{width : "800px", height : "500px"}}>
        <div className="fly"> <Card /> </div>
        <div className="flip"> <Card isBack={true}/></div>
        </div>
        <Card ratio={1} indicator='K' mark="Spade"/>
        <Card ratio={1} indicator='10' mark='heart' isBack={true}/> 
    </div>
}