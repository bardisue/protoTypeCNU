export const Direction = Object.freeze({
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
});
export default class Player extends Phaser.Physics.Arcade.Image {
    static PLAYER_SPEED = 1;

    constructor(scene) {
        super(scene, 800, 800, "cat");
        this.scale = 1;
        this.alpha = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        scene.physics.addn

    }

    npByEnemy(damage) {
    }
    sleep(milliseconds) {
        const start = Date.now();
        while ((Date.now() - start) < milliseconds);
    }

    move(direction) {
        switch (direction) {
            case Direction.Up:
                this.y -= Player.PLAYER_SPEED;
                break;

            case Direction.Down:
                this.y += Player.PLAYER_SPEED;
                break;

            case Direction.Left:
                this.x -= Player.PLAYER_SPEED;
                this.flipX = true;
                break;

            case Direction.Right:
                this.x += Player.PLAYER_SPEED;
                this.flipX = false;
                break;
        }
    }

    shootBeam() {

    }
}
