import Phaser from 'phaser';
import Config from "../Config";
import Player, { Direction } from '../characters/Player';
import Structure from '../objects/Tower';


export default class PlayingScene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
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
    }

    update() {
        this.handlePlayerMove();

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
