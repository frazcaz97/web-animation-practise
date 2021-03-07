export class Render {

    canvas: any;
    gl: any;
    vertexShader: string | undefined;
    fragmentShader: string | undefined;
    shaderProgram: any;
    programInfo: any;
    buffers: any;


    constructor() {
        this.canvas = document.querySelector('#glcanvas');
        //this.canvas.width = 640;
        //this.canvas.height = 480;
        //document.body.appendChild(this.canvas);
        this.gl = this.canvas.getContext("webgl");

        if (this.gl === null) {
            console.error("Unable to create webGL context");
            return;
        } 

        //vertex shader code
        this.vertexShader =
            `attribute vec4 aVertexPosition;
             uniform mat4 uModelViewMatrix;
             uniform mat4 uProjectionMatrix;
             void main() {
                 gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
             }`;
        
        //fragment shader code
        this.fragmentShader = 
        `void main() {
             gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
         }`;

        //shader Program
        this.shaderProgram = this.initShaderProgram(this.gl, this.vertexShader, this.fragmentShader);

        //program info
        this.programInfo = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition"),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, "uModelViewMatrix"),
            },
        };

        this.buffers = this.initBuffers(this.gl);
        this.draw(this.gl, this.programInfo, this.buffers);
    }

    initShaderProgram(gl: any, vertex: string, fragment: string): any {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertex);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragment);

        //create the shader program
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        //check if creating shader program failed
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("unable to initialise the shader Program: " + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    loadShader(gl: any, type: any, source: any): any {
        const shader = gl.createShader(type);

        //send the source to the shader object
        gl.shaderSource(shader, source);

        //compile shader program
        gl.compileShader(shader);

        //check if compiling shader failed
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("unable to compile shader: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    initBuffers(gl: any): any {
        //create buffer for the position

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        //array of positions for square
        const positions = [
             1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
            -1.0, -1.0,
        ];

        //build shape
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        return {
            position: positionBuffer,
        };
    }

    draw(gl: any, programInfo: any, buffers: any): void {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fov = 45 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

        const numComponents = 2;
        const type = gl.FLOAT;
        const normalise = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalise,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        //tell webGL to use our program while drawing
        gl.useProgram(programInfo.program);

        //set the shader uniforms
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );

        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
}