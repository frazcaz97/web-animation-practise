import Render from "./render.js";

export class Animation {

    private _imageURL: string;
    private _image: ImageBitmapSource;
    private _posX: number;
    private _posY: number;
    private _width: number;
    private _height: number;
    private _frameCount: number;
    private _currentFrame: number;
    private _duration: number;
    private _FrameTimeLeft: number;
    private _timePerFrame: number;
    private _imageLoaded: boolean;
    private _animationStates: any;

    constructor(image: string, x: number, y: number, width: number, height: number, frameCount: number, duration: number) {
        this._imageURL = image;
        this._posX = x;
        this._posY = y;
        this._width = width;
        this._height = height;
        this._frameCount = frameCount;
        this._duration = duration;
        this._timePerFrame = this._duration / this._frameCount;
        this._FrameTimeLeft = this._timePerFrame;
        this._currentFrame = 0;
        this._image = null;
        this._imageLoaded = false;
        this._animationStates = [];

        this.loadAnimationSheet();
        this.createAnimationStates();
    }

    loadAnimationSheet(): void {
        let img = new Image();
        img.onload = () => {
            this._image = img;
            this._imageLoaded = true;
        }
        img.src = this._imageURL;
    }

    createAnimationStates(): void {   //create an array of objects for each frames starting x and y points
        for (let i = 0; i < this._frameCount; i++) {
            this._animationStates.push({
                x: this._width * i,
                y: 0

            });
        }
    }

    update(delta: number): void {
        if (this._imageLoaded) {    //only play the animtion if the animation file has been loaded
            this._FrameTimeLeft -= delta;   //time left till next frame

            if (this._FrameTimeLeft <= 0) {
                if (this._currentFrame == (this._frameCount - 1)) {
                    this._currentFrame = 0;
                }
                else {
                    this._currentFrame++;
                }
                this._FrameTimeLeft = this._timePerFrame;   //reset the time until the next frame can be played
            }
            this.draw(this._animationStates[this._currentFrame].x, this._animationStates[this._currentFrame].y);
        }
    }

    draw(x: number, y: number): void {
        let obj = {
            src: this._image,
            screenX: this._posX,
            screenY: this._posY,
            frameX: x,
            frameY: y,
            width: this._width,
            height: this._height
        }
        Render.addToQueue(obj);
    }

    get x(): number {
        return this._posX;
    }

    get y(): number {
        return this._posY;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get currentFrame(): number {
        return this._currentFrame;
    }
}
