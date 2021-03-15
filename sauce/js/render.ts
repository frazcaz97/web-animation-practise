import Canvas from "./canvas.js";

class Render {

    private _queue: any;

    constructor() {
        this._queue = [];
    }

    draw(): void {
        Canvas.context.clearRect(0, 0, Canvas.width, Canvas.height);

        for (let item in this._queue) {
            let frame = this._queue[item];
            Canvas.context.drawImage(frame.src, frame.frameX, frame.frameY, frame.width, frame.height, frame.screenX, frame.screenY, frame.width, frame.height);
            this.removeFromQueue(item); //we have drawn the object, now get rid of it
        }
    }

    addToQueue(object: any): void {
        this._queue.push(object);
    }

    removeFromQueue(index: string): void {
        let value = parseInt(index);
        this._queue.splice(value, 1);
    }

}

export default new Render();