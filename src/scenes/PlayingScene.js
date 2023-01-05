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
        this.resetCharacter();

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
        if(resources>200) {
            axios.get('http://localhost:7777/users' ,
                {'Access-Control-Allow-Credentials': '*'},{
                withCredentials: true,
            }).then(res => {
                this.treatData(res.data)
                this.postPosision();
            }).catch(error => {
                console.log('erro', error);
            })
        }
    }

    postPosision(){
        axios.post('http://localhost:7777/users/save' ,{
            "nickname" : this.m_player.name,
            "point" : {
                "x" : this.m_player.getBottomCenter().x,
                "y" : this.m_player.getBottomCenter().y
            }
        },{
            withCredentials: true,
        }).then(res => {
            console.log('succes');
        }).catch(error => {
            console.log('erro', error);
        })
    }

    async resetCharacter(){
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("완료!"), 1000)
        });

        axios.get('http://localhost:7777/create_userName' ,
            {'Access-Control-Allow-Credentials': '*'},{
                withCredentials: true,
            }).then(res => {
                const tmp = JSON.stringify(res.data);
                this.m_player.setName(JSON.parse(tmp).nickname);
        }).catch(error => {
            console.log('WTF', error);
        });
        this.m_player.setPosition(800,800)

        let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)

        axios.post('http://localhost:7777/users/save' ,{
            "nickname" : this.m_player.name,
                "point" : {
                "x" : 800,
                    "y" : 800
            }
        },{
                withCredentials: true,
            }).then(res => {
            console.log('succes');
        }).catch(error => {
            console.log('erro', error);
        })

    }


    async treatData(res){
        const tmp = JSON.stringify(res)
        const myObj = JSON.parse(tmp);
        var len = myObj.length
        for(var i = 0; i <len; i++) {
            var tmpName = myObj[i].nickname
            var tmpX = myObj[i].point.x
            var tmpY = myObj[i].point.y
            if(tmpName === this.m_player.name) {
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
