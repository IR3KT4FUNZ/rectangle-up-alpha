export class InputHandler {
    constructor() {
        this.keys = [];
        this.validKeys = ['w', 'a', 's', 'd', 'j', 'k', 'u', 'i', 'h'];
        this.facingLeft = false;
        window.addEventListener('keydown', e=> {
            if (!(this.validKeys.indexOf(e.key) === -1) && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
            if (e.key === 'd') {
                this.facingLeft = false;
            } else if (e.key === 'a') {
                this.facingLeft = true;
            }
        });
        
        window.addEventListener('keyup', e => {
            if (!(this.validKeys.indexOf(e.key) === -1)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
    }
}
