//platforms
export class Platform {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(context) {
        context.fillStyle = 'grey';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
