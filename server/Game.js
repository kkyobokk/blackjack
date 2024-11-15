const { Queue } = require('./util.js');

class Card {
    static cardTypes = {
        indicator : [
            'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
        ],
        mark : [
            'Spade', 'Heart', 'Diamond', 'Clover'
        ]
    }

    constructor(indicator, mark, isFront = true){
        this.indicator = indicator;
        this.mark = mark;
        this.isFront = isFront;
    }
    flip(){this.isFront = !this.isFront; return this;}
    getCardInfo(){return {indicator : this.indicator, mark : this.mark};}
}

class Deck {
    constructor(){
        this.deck = (() => {
            const p = Object.values(Card.cardTypes);
            return p[1].reduce((a,e) => {
                return [...a, ...p[0].map(E => new Card(E,e,false))];
                //p[0].map(E => new Card(E, e)).forEach(e => a.enqueue(e));
                //return a;
            },  /*new Queue()*/ []);
        })();
    }

    getDeck(){return this.deck.slice();}

    combine(deck){
        if(!(deck instanceof Deck)) return null;
        this.deck.concat(deck.getDeck());
        return this;
    }

    shuffle(){
        this.deck.slice().forEach((e,i) => {
            let j = Math.floor(Math.random()*(i+1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        });
        return this;
    }

    draw(count = 1){
        if(Number.isNaN(Number(count))) return null;
        if(count === 1) return this.deck.shift();
        else return Array(count).fill(0).map(() => this.deck.shift());
    }
}

class Player {
    constructor(id, enteredGame, cash = 10000){
        this.id = id;
        this.cardset = [];
        this.state = "onStart";
        this.gameState = "goWay";
        this.cash = cash;
        this.betting = 0;
        this.entering = enteredGame;
        this.isDealer = cash === 0;
    }

    getInfo(){
        return {
            id : this.id,
            cardset : this.cardset,
            state : this.state,
            gameState : this.gameState,
            cash : this.cash,
            betting : this.betting
        }
    }
    getId(){return this.id;}

    merge(key, value){return this[key] = value;}

    transState(state){this.state = state;}

    transGameState(state){this.entering.GamerState(this.id, state);return this.gameState = state;}

    getTotal(){
        const p = this.cardset.map(e => {
            const p = e.getCardInfo().indicator;
            return !["J", "Q", "K"].includes(p) ? Number(p) : p !== 'A' ? 10 : 'A';
        });
        const exceptA = p.filter(e => e !== 'A').reduce((a,e)=>a+e,0);
        const countA = p.filter(e => e === 'A').length;
        
        return {
            exceptA,
            countA,
            least : exceptA + countA
        };
    }

    bet(bet){
        if(bet > this.cash) return false;
        this.betting = bet;
        return true;
    }

    onStart(){
        this.isDealer ? this.merge('cardset', this.entering.deck.draw(2).map((e,i) => i ? e : e.flip()))
        : this.merge('cardset', this.entering.deck.draw(2));

        if(this.selectionOfTotal().at(-1) === 21){
            this.transGameState('BlackJack')
        }
    }

    hit(){
        this.cardset.push(this.entering.deck.draw().flip());
        if(this.getTotal().least > 21){ this.transGameState("Burst") }
        this.entering.TurnPlayerSelect(this.id, 'hit');
    }

    stay(){
        this.transGameState('selecting');
        this.entering.hittingPlayer.splice(this.entering.hittingPlayer.indexOf(this), 1);
    }

    selectionOfTotal(){
        const { countA, exceptTotal } = this.getTotal();
        return Array(countA).fill(0).map((_,i) => exceptTotal + (i+1) + 11*(n-i-1));
    }

    selectFromStay(){

    }

    split(){}

    doubleDown(){}
}

class Game {
    static Games = new Map();
    static getGame(id){return Game.Games.get(id);}

    constructor(id, players, deckCount=4){
        this.id = id || Number(new Date());
        this.players = Object.fromEntries(players.map(e => [e, new Player(e, this)]));
        this.hittingPlayer = players.slice();
        this.dealer = new Player("Dealer#0", this, 0);
        this.turn = null;
        this.deck = Array(deckCount-1).fill(0).reduce(a => a.combine(new Deck), new Deck()).shuffle();
        Game.Games.set(id, this);
    }

    getPlayerById(id){return this.players[id];}
    getTurnPlayer(){return this.turn;}
    getAllPlayers(){return Array.from(Object.values(this.players));}

    Betting(){}

    OnStart(){
        const players = this.getAllPlayers();
        players.forEach(e => e.onStart());
        players.forEach(e => e.transState('onWait'));
        this.dealer.onStart(true);
        this.turn = this.getPlayerById(this.hittingPlayer[Math.floor(Math.random()*(players.length-1))]);
        this.hittingPlayer.splice(this.hittingPlayer.indexOf(this.turn), 0, this.dealer);
        console.log(this.turn);
        this.turn.transState('hasTurned');
        return true;
    }

    TurnPlayerSelect(id, selection){
        (this.turn = this.hittingPlayer[(this.hittingPlayer.indexOf(id)+1) % this.hittingPlayer.length]).transState('hasTurned');
        this.players[id].transState('onWait');
    }

    OnGameSet(){

    }

    GamerState(id, state){
        if(this.hittingPlayer.length === 0)
        switch(state){
            case "BlackJack" :
                if(this.dealer.id === id){
                    
                }
                break;
            case "Burst" :
            case "selecting" :
            case "stay" :
            default : break;
        }
    }

}

exports.Card = Card;
exports.Deck = Deck;
exports.Game = Game;