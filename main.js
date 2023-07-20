import { Platform } from './platform.js';
import { Character } from './character.js';
import { InputHandler } from './input.js';
import { Bot } from './bot.js';

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
            this.bot = new Bot(this, canvas.width, canvas.height);
            this.input = new InputHandler();
        }

        update() {
            this.character.update(this.input.keys, this.input.facingLeft);
            this.bot.update();
            this.checkCharacterCollision(this.bot.x, this.bot.y, this.bot.width, this.bot.height, this.character.x, this.character.y, this.character.width, this.character.height);
            this.checkBotHit(this.bot.x, this.bot.y, this.bot.width, this.bot.height, this.character.attackX, this.character.attackY, this.character.attackW, this.character.attackH);
        }

        draw(context) {
            this.platformLeft.draw(context);
            this.platformRight.draw(context);
            this.character.draw(context);
            this.bot.draw(context);
        }

        createSpace(x1, x2) {
            if (x1 <= x2) {
                this.bot.x = Math.max(0, this.bot.x - 200);
                this.character.x = Math.min(canvas.width, this.character.x + 200);
            } else {
                this.bot.x = Math.min(canvas.width, this.bot.x + 200);
                this.character.x = Math.max(0, this.character.x - 200);
            }
        }
        
        checkCharacterCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
            if (this.intersect(x1, y1, w1, h1, x2, y2, w2, h2)) {

            }
        }

        checkBotHit(x1, y1, w1, h1, x2, y2, w2, h2) {
            if (this.intersect(x1, y1, w1, h1, x2, y2, w2, h2) && window.performance.now() - this.character.lastHit > 500) {
                if (this.character.lightAttacking) {
                    this.bot.health = Math.max(0, this.bot.health - 8);
                    this.character.lastHit = window.performance.now();
                } else if (this.character.heavyAttacking) {
                    this.bot.health = Math.max(0, this.bot.health - 15);
                    this.character.lastHit = window.performance.now();
                } else if (this.character.uppercutting) {
                    this.bot.health = Math.max(0, this.bot.health - 12);
                    this.character.lastHit = window.performance.now();
                } else if (this.character.groundpound) {
                    this.bot.health = Math.max(0, this.bot.health - 15);
                    this.character.lastHit = window.performance.now();
                }
                //play a get hit sfx
            }
        }

        intersect(x1, y1, w1, h1, x2, y2, w2, h2) {
            this.aLeftOfB = (x1 + w1) < x2;
            this.aRightOfB = x1 > (x2 + w2);
            this.aAboveB = y1 > (y2 + h2);
            this.aBelowB = (y1 + h1) < y2;
            return !(this.aLeftOfB || this.aRightOfB || this.aAboveB || this.aBelowB);
        } 
    }

    const game = new Game(canvas.width, canvas.height);

    //loops 60fps
    function animate() {
        //clear and redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        if (game.bot.alive) {
            requestAnimationFrame(animate);
        }
    }

    animate();
});
