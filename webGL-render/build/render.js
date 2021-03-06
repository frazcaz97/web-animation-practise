export class Renderer {
    constructor() {
        this.canvas = document.createElement("CANVAS");
        this.canvas.width = 200;
        this.canvas.height = 200;
        let context = this.canvas.getContext("2d");
        context.fillStyle = "green";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        document.body.appendChild(this.canvas);
    }
}
