import { gl } from './game.js';

class Terrain {
	constructor() {
		this.terrPos = glMatrix.vec3.clone([Math.floor(Math.random() * 70 * 2) - 70,
			Math.floor(Math.random() * 70 * 2) - 50,
			-30.0]);
		this.color = [this.terrPos[0] / 70, this.terrPos[1] / 70, 1.0, 1.0];
	}
}

export { Terrain };