import { Platform } from './platform.js';
import { Character } from './character.js';
import { InputHandler } from './input.js';
import { Healthbar } from './healthbar.js';

window.addEventListener('load', function(){
    //EVERY OBJECT MUST HAVE AN UPDATE METHOD AND A DRAW METHOD
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1860;        //make variable
    canvas.height = 920;        //make variable
    

    class Game {
        
        constructor(width, height) {
            this.platformLeft = new Platform(300, 600, 400, 20);
            this.platformRight = new Platform(1160, 600, 400, 20);
            this.width = width;
            this.height = height;
            this.character = new Character(this, canvas.width, canvas.height);
            this.input = new InputHandler();
        }

        update() {
            this.character.update(this.input.keys, this.input.facingLeft);
        }

        draw(context) {
            this.platformLeft.draw(context);
            this.platformRight.draw(context);
            this.character.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    //loops 60fps
    function animate() {
        //clear and redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate();
});
