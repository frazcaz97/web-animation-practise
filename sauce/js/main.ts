import Canvas from "./canvas.js";
import Render from "./render.js";
import { Animation } from "./animation.js";

//engine variables
const FPS: number = 144;
const frameInterval: number = 1000/ FPS;
let thisTime: number = 0; 
let lastTime: number = 0; 
let delta: number = 0;

//animation resource
const sprite = new Animation('sauce/animation/testAnimation.png', 0, 0, 256, 256, 6, 500);

const run = (step: number) => {
    
    thisTime = step;
    delta = thisTime - lastTime;

    if (delta >= frameInterval) {
        //update the state before drawing
        sprite.update(delta);

        lastTime = thisTime;
    }

    //draw the new frame
    Render.draw();

    window.requestAnimationFrame(run);
}

const main = () => {
    Canvas.width = 1024;
    Canvas.height = 128;    
    window.requestAnimationFrame(run);
}

main();