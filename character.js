import { Healthbar } from "./healthbar.js";
//player or AI controlled characters
export class Character {
    //constructor
    constructor(game, frameWidth, frameHeight) {
        this.health = 100;
        this.game = game;
        this.width = 40; //placeholder
        this.height = 90; //placeholder
        this.x = 0; 
        this.y = this.game.height - this.height;
        this.xVel = 10;
        this.yVel = 0;
        this.gAccel = 0.7;
        this.maxWidth = frameWidth;
        this.maxHeight = frameHeight;
        this.lastAttack = -100000.0;
        this.lastStun = 0.0;
        this.lightAttacking = false;
        this.heavyAttacking = false;
        this.uppercutting = false;
        this.groundpound = false;
        this.yVelMax = 20;
        this.facingLeft = false;
        this.attackX = 0;
        this.attackY = 0;
        this.attackW = 0;
        this.attackH = 0;
        this.healthbar = new Healthbar(this.health, this.health);
    }

    //moves it around
    update(keys, facingLeft) {
        if (keys.includes('d') && this.x < this.maxWidth - this.width) {
            this.x = this.x + this.xVel;      //velocity
        }
        if (keys.includes('a') && this.x >= this.xVel) {
            this.x = this.x - this.xVel;       //velocity
        }
        if (keys.includes('s') && this.onGround()) {
            if (this.onFloor()) {
                this.height = 49;
                this.y = this.game.height - this.height;
            } else if (this.onPlatform()){
                this.height = 49;
                this.y = 600 - this.height;
            }
            
        } else if (this.onGround()) {
            this.height = 90;
            if (this.onFloor()) {
                this.y = this.game.height - this.height;
            } else {
                this.y = 600 - this.height;
            }   
        } else if (keys.includes('s')) {
            this.gAccel = 2;
        }
        if (keys.includes('w') && this.onGround()) {
            this.yVel = -28;
            this.y += this.yVel;
        } 
        if (!this.onGround()) {
            this.height = 90;
            this.yVel = Math.min(20, this.yVel + this.gAccel);
            this.y = this.y + this.yVel;
        }
        this.gAccel = 1;
        if (keys.includes('j')) {
            this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                //proceed with attack animation here
                this.lightAttacking = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 800;      //change if necessary
            }
        }
        if (keys.includes('k')) {
            this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                //proceed with attack animation here
                this.heavyAttacking = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 1500;      //change if necessary
            }
        }
        if (keys.includes('i')) {
            this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                //proceed with attack animation here
                this.uppercutting = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 1200;      //change if necessary
            }
        }
        if (keys.includes('u') && !this.onGround()) {
            this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                //proceed with attack animation here
                this.groundpound = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 1000;      //change if necessary
            }
        }
        if (window.performance.now() - this.lastAttack > 200 && this.lightAttacking) {
            this.lightAttacking = false;
        }
        if (window.performance.now() - this.lastAttack > 400 && this.heavyAttacking) {
            this.heavyAttacking = false;
        }
        if (window.performance.now() - this.lastAttack > 300 && this.uppercutting) {
            this.uppercutting = false;
        }
        if ((window.performance.now() - this.lastAttack > 600 || this.onGround()) && this.groundpound) {
            this.groundpound = false;
        }
        if (keys.includes('h') && this.onPlatform()) {
            this.y += 21;
        }
        if (!this.lightAttacking && !this.heavyAttacking && !this.uppercutting) {
            this.facingLeft = facingLeft;
        }

        this.healthbar.update(this.health);
    }

    //takes values to draw currently active frame
    draw(context) {
        context.fillStyle = 'black';
        context.fillRect(this.x, this.y, this.width, this.height);
        context.lineWidth = 5;
        context.strokeStyle = 'grey';
        context.strokeRect(0, 0, 400, 30);
        context.fillStyle = `rgb(102, 255, 102)`;
        context.fillRect(0, 0, 400 * this.healthbar.Hp / this.healthbar.maxHp - 2, 28);
        context.fillStyle = 'black';
        if (!this.facingLeft) {
            context.clearRect(this.x + 22, this.y + 8, 10, 10);
        } else {
            context.clearRect(this.x + 8, this.y + 8, 10, 10);
        }
        if (this.groundpound) {
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y + this.height - 20, this.width, 20);
        }
        if (!this.facingLeft) {
            if (this.lightAttacking) {
                context.fillRect(this.x + this.width, this.y + 20, Math.min(((window.performance.now() - this.lastAttack) / 40.0) * 30, 40), 20);
            } else if (this.heavyAttacking) {
                context.fillRect(this.x + this.width, this.y + 30, Math.min(((window.performance.now() - this.lastAttack) / 60.0) * 40, 60), 19);
            } else if (this.uppercutting) {
                context.fillRect(this.x + this.width, this.y - 20, 20, 60);
                context.clearRect(this.x + this.width, this.y - 20, 20, Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30));
            }
        } else {
            if (this.lightAttacking) {
                context.fillRect(this.x - 40, this.y + 20, 40, 20);
                context.clearRect(this.x - 40, this.y + 20, Math.max(40 - ((window.performance.now() - this.lastAttack) / 40.0) * 30, 0), 20);
            } else if (this.heavyAttacking) {
                context.fillRect(this.x - 60, this.y + 30, 60, 20);
                context.clearRect(this.x - 60, this.y + 30, Math.max(60 - ((window.performance.now() - this.lastAttack) / 60.0) * 40, 0), 19);
            } else if (this.uppercutting) {
                context.fillRect(this.x - 20, this.y - 20, 20, 60);
                context.clearRect(this.x - 20, this.y -20, 20, Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30));
            }
        }
    }

    onPlatform() {
        if (this.yVel >= 0 && this.y >= 600 - this.height && this.y <= 620 - this.height && ((this.x > 260 && this.x < 700) || (this.x > 1120 && this.x < 1560))) {
            this.yVel = 0;
            this.y = 600 - this.height;
            return true;
        }
        return false;
    }

    onFloor() {
        return this.y >= this.game.height - this.height;
    }
    //checks if character is on the ground
    onGround() {
        return this.onPlatform() || this.onFloor();
    }

}
