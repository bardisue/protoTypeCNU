
export default class Player extends Phaser.Physics.Arcade.Image {

    constructor(scene) {
        super(scene, 800, 480, "some");
        this.scale = 2;
        this.alpha = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}
