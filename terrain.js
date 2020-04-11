import { gl } from './game.js';

class Terrain {
	constructor() {
		this.terrPos = glMatrix.vec3.clone([Math.floor(Math.random() * 70 * 2),
			Math.floor(Math.random() * 70 * 1),
			Math.floor(Math.random() * 10)]);
		this.color = [this.terrPos[0] / 70, this.terrPos[1] / 70, this.terrPos[0] / 10, 1.0];
	}
}

export { Terrain };