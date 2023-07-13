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
        this.xVel = 7.5;
        this.yVel = 0;
        this.gAccel = 0.7;
        this.maxWidth = frameWidth;
        this.maxHeight = frameHeight;
        this.lastAttack = -100000.0;
        this.lastHit = -100000.0;
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
        if (keys.includes('d')) {
            this.commandd();
        }
        if (keys.includes('a')) {
            this.commanda();
        }
        if (this.onGround()) {
            this.resetOnGround();
        }
        if (keys.includes('s')) {
            this.commands();
        } 
        if (keys.includes('w')) {
            this.commandw();
        } 
        if (!this.onGround()) {
            this.moveDown();
        }
        this.gAccel = 1;
        if (keys.includes('j')) {
            this.commandj();
        }
        if (keys.includes('k')) {
            this.commandk();
        }
        if (keys.includes('i')) {
            this.commandi();
        }
        if (keys.includes('u') && !this.onGround()) {
            this.commandu();
        }
        this.checkAttackEnd();
        if (keys.includes('h')) {
            this.commandh();
        }
        this.updateFacingDirection(facingLeft);
        this.updateHp();
    }

    commandd() {
        if (this.x < this.maxWidth - this.width) {
            this.x = this.x + this.xVel;      
        }
    }

    commanda() {
        if (this.x >= this.xVel) {
            this.x = this.x - this.xVel;       
        }
    }

    commands() {
        if (this.onGround()) {
            if (this.onFloor()) {
                this.height = 49;
                this.y = this.game.height - this.height;
            } else if (this.onPlatform()){
                this.height = 49;
                this.y = 600 - this.height;
            } 
        } else {
            this.gAccel = 2;
        }
    }

    resetOnGround() {
        this.height = 90;
        if (this.onFloor()) {
            this.y = this.game.height - this.height;
        } else {
            this.y = 600 - this.height;
        }   
    }

    commandw() {
        if (this.onGround()) {
            this.yVel = -28;
            this.y += this.yVel;
        } 
    }

    moveDown() {
        this.height = 90;
        this.yVel = Math.min(20, this.yVel + this.gAccel);
        this.y = this.y + this.yVel;
    }

    commandj() {
        this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                //proceed with attack animation here
                this.lightAttacking = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 800;      //change if necessary
            }
    }

    commandk() {
        this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                //proceed with attack animation here
                this.heavyAttacking = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 1500;      //change if necessary
            }
    }

    commandi() {
        this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                //proceed with attack animation here
                this.uppercutting = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 1200;      //change if necessary
            }
    }

    commandu() {
        if (!this.onGround()) {
            this.time = window.performance.now();
            if (this.time - this.lastAttack >= this.lastStun) {
                this.height = 70;
                //proceed with attack animation here
                this.groundpound = true;
                //update necessary variables
                this.lastAttack = this.time;
                this.lastStun = 1000;      //change if necessary
            }
        }
    }

    commandh () {
        if (this.onPlatform()) {
            this.y += 21;
        }
    }

    checkAttackEnd() {
        if (window.performance.now() - this.lastAttack > 200 && this.lightAttacking) {
            this.lightAttacking = false;
            this.resetAttack();
        } else if (window.performance.now() - this.lastAttack > 400 && this.heavyAttacking) {
            this.heavyAttacking = false;
            this.resetAttack();
        } else if (window.performance.now() - this.lastAttack > 300 && this.uppercutting) {
            this.uppercutting = false;
            this.resetAttack();
        } else if (((window.performance.now() - this.lastAttack > 600 || this.onGround()) && this.groundpound) || this.yVel <= 0) {
            this.groundpound = false;
            this.resetAttack();
        }
    }    

    resetAttack() {
        this.attackX = -1;
        this.attackY = -1;
        this.attackW = 0;
        this.attackH = 0;
    }

    updateFacingDirection(facingLeft) {
        if (!this.lightAttacking && !this.heavyAttacking && !this.uppercutting) {
            this.facingLeft = facingLeft;
        }
    }

    updateHp() {
        this.healthbar.update(this.health);
    }

    //takes values to draw currently active frame
    draw(context) {
        this.drawCharacter(context);
        this.drawHealthbar(context);
        this.drawAttack(context);
    }

    drawAttack(context) {
        if (this.groundpound) {
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y + this.height - 20, this.width, 20);
            this.attackX = this.x;
            this.attackY = this.y + this.height - 20;
            this.attackW = this.width;
            this.attackH = 20;
        }
        if (!this.facingLeft) {
            if (this.lightAttacking) {
                context.fillRect(this.x + this.width, this.y + 20, Math.min(((window.performance.now() - this.lastAttack) / 40.0) * 30, 40), 20);
                this.attackX = this.x + this.width;
                this.attackY = this.y + 20;
                this.attackW = Math.min(((window.performance.now() - this.lastAttack) / 40.0) * 30, 40);
                this.attackH = 20;
            } else if (this.heavyAttacking) {
                context.fillRect(this.x + this.width, this.y + 30, Math.min(((window.performance.now() - this.lastAttack) / 60.0) * 40, 60), 19);
                this.attackX = this.x + this.width;
                this.attackY = this.y + 30;
                this.attackW = Math.min(((window.performance.now() - this.lastAttack) / 60.0) * 40, 60);
                this.attackH = 19;
            } else if (this.uppercutting) {
                context.fillRect(this.x + this.width, this.y - 20, 20, 60);
                context.clearRect(this.x + this.width, this.y - 20, 20, Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30));
                this.attackX = this.x + this.width;
                this.attackY = this.y - 40 + Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30);
                this.attackW = 20;
                this.attackH = 60 - Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30)
            }
        } else {
            if (this.lightAttacking) {
                context.fillRect(this.x - 40, this.y + 20, 40, 20);
                context.clearRect(this.x - 40, this.y + 20, Math.max(40 - ((window.performance.now() - this.lastAttack) / 40.0) * 30, 0), 20);
                this.attackX = this.x - 40 + Math.max(40 - ((window.performance.now() - this.lastAttack) / 40.0) * 30, 0);
                this.attackY = this.y + 20
                this.attackW = 40 - Math.max(40 - ((window.performance.now() - this.lastAttack) / 40.0) * 30, 0);
                this.attackH = 20;
            } else if (this.heavyAttacking) {
                context.fillRect(this.x - 60, this.y + 30, 60, 20);
                context.clearRect(this.x - 60, this.y + 30, Math.max(60 - ((window.performance.now() - this.lastAttack) / 60.0) * 40, 0), 19);
                this.attackX = this.x - 60 + Math.max(60 - ((window.performance.now() - this.lastAttack) / 60.0) * 40, 0);
                this.attackY = this.y + 30
                this.attackW = 60 - Math.max(60 - ((window.performance.now() - this.lastAttack) / 60.0) * 40, 0);
                this.attackH = 19;
            } else if (this.uppercutting) {
                context.fillRect(this.x - 20, this.y - 20, 20, 60);
                context.clearRect(this.x - 20, this.y -20, 20, Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30));
                this.attackX = this.x - 20;
                this.attackY = this.y - 40 + Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30);
                this.attackW = 20;
                this.attackH = 60 - Math.max(0, 60 - ((window.performance.now() - this.lastAttack) / 40.0) * 30);
            }
        }
    }

    drawCharacter(context) {
        context.fillStyle = 'black';
        context.fillRect(this.x, this.y, this.width, this.height);
        if (!this.facingLeft) {
            context.clearRect(this.x + 22, this.y + 8, 10, 10);
        } else {
            context.clearRect(this.x + 8, this.y + 8, 10, 10);
        }
    }

    drawHealthbar(context) {
        context.lineWidth = 5;
        context.strokeStyle = 'grey';
        context.strokeRect(0, 0, 400, 30);
        context.fillStyle = `rgb(102, 255, 102)`;
        context.fillRect(0, 2, (400.0 * this.healthbar.Hp) / this.healthbar.maxHp - 2, 26);
        context.fillStyle = 'black';
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
