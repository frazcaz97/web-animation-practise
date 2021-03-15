class Canvas {

    private _width: number;
    private _height: number;
    private _canvas: any;
    private _ctx: CanvasRenderingContext2D;

    constructor() {

        this._canvas = document.querySelector("#canvas");
        this._ctx = this._canvas.getContext("2d");
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    }

    get canvas(): Object {
        return this._canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this._ctx;
    }

    get width(): number {
        return this._canvas.width;
    }

    set width(value) {
        this._width = value;
    }

    get height(): number {
        return this._canvas.height;
    }

    set height(value) {
        this._height = value;
    }
    
}

export default new Canvas();