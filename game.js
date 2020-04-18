import { Quad } from './quad.js';
import { Shader, vsCode, fsCode } from './shader.js';
import { Texture } from './texture.js';
import { Terrain } from './terrain.js';

const gl = canvas.getContext('webgl2');

class Game {
	constructor() {
		canvas.requestPointerLock = canvas.requestPointerLock;
		document.exitPointerLock = document.exitPointerLock;
		this.quad = new Quad(new Shader(vsCode, fsCode));
		this.keypress = new Array(256).fill(false);
		this.fov = 70;
		this.x = 0;
		this.y = 0;
		this.newX = 0;
		this.oldX = 0;
		this.terrainTexture = Texture.load('./res/terrain.png');
		this.terrains = [];
		for (let i = 0; i < 20; i++) this.terrains.push(new Terrain());
		window.addEventListener('keydown', this.keysDown);
		window.addEventListener('keyup', this.keysUp);
		canvas.addEventListener('click', this.onClick);
		document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
		this.gamePos = [0.0, 0.0, -24.0];
	}

	start = () => {
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		this.animate();
	}

	lockChangeAlert = () => {
		if (document.pointerLockElement === canvas) 
			document.addEventListener('mousemove', this.mouseMove, false);
		else
			document.removeEventListener('mousemove', this.mouseMove, false);
	}

	animate = (time = 0) => {
		this.tick();
		this.render(time);
		if (gl.getError()) {
			console.log(gl.getError());
		}
		window.requestAnimationFrame(this.animate);
	}

	tick = () => {
		if (this.keypress[37]) {
			glMatrix.vec3.add(this.gamePos, this.gamePos, [-0.2, 0.0, 0.0]);
			console.log(this.gamePos);
		}
		if (this.keypress[39]) {
			glMatrix.vec3.add(this.gamePos, this.gamePos, [0.2, 0.0, 0.0]);
			console.log(this.gamePos);
		}
		if (this.keypress[38]) {
			glMatrix.vec3.add(this.gamePos, this.gamePos, [0.0, .0, 0.2]);
			// glMatrix.vec3.add(this.gamePos, this.gamePos, [0.0, 0.02, 0.0]);
			console.log(this.gamePos);
		}
		if (this.keypress[40]) {
			// glMatrix.vec3.add(this.gamePos, this.gamePos, [0.0, -0.002, 0.0]);
			glMatrix.vec3.add(this.gamePos, this.gamePos, [0.0, .0, -0.2]);
			console.log(this.gamePos);
		}
		this.newX = this.x;
		if (this.newX > this.oldX) {
			// *************Right*******************'
			glMatrix.vec3.add(this.gamePos, this.gamePos, [-7., .0, .0]);
		}
		if (this.newX < this.oldX) {
			// **************Left*******************
			glMatrix.vec3.add(this.gamePos, this.gamePos, [7., .0, .0]);
		}
		if (this.newX === this.oldX) {
			// *************Still*******************
		}
		this.oldX = this.newX;
	}

	render = (time) => {
		if (!this.terrainTexture.loaded) return;
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		const viewMatrix = glMatrix.mat4.create();
		glMatrix.mat4.perspective(viewMatrix, this.fov, canvas.width / canvas.height, 0.1, 1000);
		const cameraMatrix = glMatrix.mat4.create();
		glMatrix.mat4.translate(cameraMatrix, cameraMatrix, this.gamePos);
		// glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [-62, 0, 50]);

		const screenMatrix = glMatrix.mat4.create();
		glMatrix.mat4.scale(screenMatrix, screenMatrix, [1 / canvas.width, 1 / canvas.width, 1 / 480])
		// glMatrix.mat4.rotateX(screenMatrix, screenMatrix, glMatrix.glMatrix.toRadian(-90));

		this.quad.setTexture(this.terrainTexture);
		this.quad.setCamera(viewMatrix, screenMatrix);
		for (let ter of this.terrains) {
			this.quad.render(glMatrix.vec3.transformMat4(glMatrix.vec3.create(), ter.terrPos, cameraMatrix), 30, 30, 0, 0, ter.color);
		}
	}

	keysUp = (e) => {
		this.keypress[e.keyCode] = false;
	}

	keysDown = (e) => {
		this.keypress[e.keyCode] = true;
	}

	mouseMove = (e) => {
		// TODO: Change the mouse coordinate position to x = 0 after it reaches out of the canvas width
		this.x += e.movementX;
		// this.y += e.movementY;
	}

	onClick = () => {
		canvas.requestPointerLock();
	}
}

window.game = new Game();
game.start();

export { gl };
