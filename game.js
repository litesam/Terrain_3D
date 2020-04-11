import { Quad } from './quad.js';
import { Shader, vsCode, fsCode } from './shader.js';
import { Texture } from './texture.js';
import { Terrain } from './terrain.js';

const gl = canvas.getContext('webgl2');

class Game {
	constructor() {
		this.quad = new Quad(new Shader(vsCode, fsCode));
		this.keypress = new Array(256).fill(false);
		this.fov = 70;
		this.x = 0;
		this.y = 0;
		this.terrainTexture = Texture.load('./res/terrain.png');
		this.terrains = [];
		for (let i = 0; i < 500; i++) this.terrains.push(new Terrain());
		window.addEventListener('keydown', this.keysDown);
		window.addEventListener('keyup', this.keysUp);
		canvas.addEventListener('mousemove', this.mouseMove);
		this.gamePos = [0.0, 0.0, -1.0];
	}

	start = () => {
		this.animate();
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
	}
	sx=0
	render = (time) => {
		if (!this.terrainTexture.loaded) return;
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		const viewMatrix = glMatrix.mat4.create();
		glMatrix.mat4.perspective(viewMatrix, this.fov, canvas.width / canvas.height, 0.1, 1000);
		// console.log(this.terrainTexture.img)
		const cameraMatrix = glMatrix.mat4.create();
		glMatrix.mat4.translate(cameraMatrix, cameraMatrix, this.gamePos);
		glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [-62, 0, -30]);

		const screenMatrix = glMatrix.mat4.create();
		glMatrix.mat4.scale(screenMatrix, screenMatrix, [1 / canvas.width, 1 / canvas.width, 1 / 480])
		glMatrix.mat4.rotateX(screenMatrix, screenMatrix, glMatrix.glMatrix.toRadian(-90));
		// console.log(screenMatrix)
		this.quad.setTexture(this.terrainTexture);
		this.quad.setCamera(viewMatrix, screenMatrix);
		for (let ter of this.terrains) {
			this.quad.render(glMatrix.vec3.transformMat4(glMatrix.vec3.create(), ter.terrPos, cameraMatrix), 2, 2, 0, 0, ter.color);
		}
		// this.quad.render(glMatrix.vec3.transformMat4(glMatrix.vec3.create(), this.gamePos, cameraMatrix), 256, 256, 0, 0, [1.0, 1.0, 1.0, 1.0]);
		// this.quad.render(glMatrix.vec3.transformMat4(glMatrix.vec3.create(), [-Math.sin(time / 2) / 200 * 1, Math.cos(time) / 100, Math.PI * -20], cameraMatrix), 40, 40, 0, 0, [1.0, 1.0, 1.0, 1.0]);
		// this.quad.render(glMatrix.vec3.transformMat4(glMatrix.vec3.create(), [-Math.sin(time) / 200 * 2, Math.cos(time) / 200, Math.PI * -20], cameraMatrix), 40, 40, 0, 0, [1.0, 1.0, 1.0, 1.0]);
		// this.quad.render(glMatrix.vec3.transformMat4(glMatrix.vec3.create(), [Math.sin(time) / 200 * 3, Math.cos(time) / 400, Math.PI * -20], cameraMatrix), 40, 40, 0, 0, [1.0, 1.0, 1.0, 1.0]);
		// this.sx++
		// this.quad.render(glMatrix.vec3.transformMat4(glMatrix.vec3.create(), [this.x, this.y, Math.PI * -20], cameraMatrix), 40, 40, 0, 0, [1.0, 1.0, 1.0, 1.0]);
	}

	keysUp = (e) => {
		this.keypress[e.keyCode] = false;
	}

	keysDown = (e) => {
		this.keypress[e.keyCode] = true;
	}

	mouseMove = (e) => {
		this.x = (e.clientX / 10) - 96;
		this.y = -(e.clientY / 11.468);
	}
}

window.game = new Game();
game.start();

export { gl };
