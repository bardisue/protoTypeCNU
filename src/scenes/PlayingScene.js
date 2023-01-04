import Phaser from 'phaser';
import Config from "../Config";
import Player, { Direction } from '../characters/Player';
import Structure from '../objects/Tower';
import * as phaser from "phaser";
import axios, {create} from "axios";


export default class PlayingScene extends Phaser.Scene {

    triggerTimer = phaser.Time.TimerEvent;
    constructor() {
        super("playGame");
    }

    create() {

        this.playList = []
        // sound
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_pickupSound = this.sound.add("audio_pickup");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_gameoverSound = this.sound.add("audio_gameover");
        this.m_pauseInSound = this.sound.add("pause_in");
        this.m_pauseOutSound = this.sound.add("pause_out");
        this.m_hitEnemySound = this.sound.add("hit_enemy");

        // background
        this.m_background = this.add.tileSprite(0, 0, Config.width, Config.height, "background");
        this.m_background.setOrigin(0, 0);
        //minimap
       // this.minimap = this.cameras.add(10, 10, 500, 500).setZoom(0.2).setName('mini');
       // this.minimap.setBackgroundColor(0x002244);
   //     this.minimap.scrollX = 1600;
      //  this.minimap.scrollY = 300;
        // player
        //this.m_player = new Player(this);
        this.m_player = new Player(this);

        axios.get('http://localhost:7777/createChar' ,
            {'Access-Control-Allow-Credentials': '*'},{
                withCredentials: true,
            }).then(res => {
            // res.data.forEach(str => console.log(str));
            treatData(res.data)
        }).catch(error => {
            console.log('erro', error);
        })

        this.cameras.main.setBounds(0, 0, 3000, 2121);
        //this.m_player.add(new Player(this));
        this.cameras.main.startFollow(this.m_player);
        //this.cameras.main.setSize(200,200);
        this.cameras.main.setZoom(10,10);
        //this.cameras.main.setSize(3000,2000)
        //this.cameras.resize(200 ,200);
        //this.cameras.onResize(200,200);
        // keys
        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        console.log(this.m_cursorKeys);
        //Object
        this.m_tower = new Structure(this);

        this.physics.add.collider(this.m_player, this.m_tower);
        this.resources = 0;
        this.timer = 0;

    }
    state = {
        arr:[]
    }
    timerEvent(resources) {
        axios.defaults.withCredentials = true;
        if(resources%50 ==0) {
            axios.get('http://localhost:7777/users' ,
                {'Access-Control-Allow-Credentials': '*'},{
                withCredentials: true,
            }).then(res => {
                this.treatData(res.data)
            }).catch(error => {
                console.log('erro', error);
            })
            console.log(this.m_player.getBottomCenter());
        }
    }

    resetCharacter(res){

    }


    treatData(res){
        const tmp = JSON.stringify(res)
        const myObj = JSON.parse(tmp);
        var len = myObj.length
        for(var i = 0; i <len; i++) {
            var tmpName = myObj[i].nickname
            var tmpX = myObj[i].point.x
            var tmpY = myObj[i].point.y
            if(tmpName == this.m_player.name) {
                continue;
            }
            var found = this.playList.find(element => element.name == tmpName);
            if(found == undefined){
                var nP = new Player(this);
                nP.setName(tmpName);
                nP.setPosition(tmpX,tmpY)
                this.playList.push(nP);
            }
            else{
                found.setPosition(tmpX,tmpY);
            }
            /***
            if(!this.playList.){
                var nP = new Player(this);
                nP.setName(tmpName);
                nP.setPosition(tmpX,tmpY)
                this.playList.push(nP);
            }
            else {
                var found = playList.find(element => element.name == tmpName);
                found.setPosition(tmpX,tmpY)
            }
             ***/
        }
    }






    update() {
        this.resources += 1;
        this.handlePlayerMove();
        this.timerEvent(this.resources)
    }

    //////////////////////// FUNCTIONS ////////////////////////

    handlePlayerMove() {
        if (this.m_cursorKeys.left.isDown) {
            this.m_player.move(Direction.Left);
        } else if (this.m_cursorKeys.right.isDown) {
            this.m_player.move(Direction.Right);
        }

        if (this.m_cursorKeys.up.isDown) {
            this.m_player.move(Direction.Up);
        } else if (this.m_cursorKeys.down.isDown) {
            this.m_player.move(Direction.Down);
        }
    }

}
