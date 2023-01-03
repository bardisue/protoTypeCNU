import Config from "./Config";
// remove fakeXMLHttpRequest
const tmp = XMLHttpRequest
XMLHttpRequest = undefined
// init axios
const axios = require('axios').default
// restore fakeXMLHttpRequest
XMLHttpRequest = tmp

axios.defaults.withCredentials = true;


const game = new Phaser.Game(Config);

export default game;
