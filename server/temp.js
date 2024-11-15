const { Deck } = require('./Game.js');

const deck = new Deck();

//console.log(deck.getDeck());
//console.log(deck.shuffle());
deck.shuffle();
console.log(deck.draw(50));
console.log(deck);