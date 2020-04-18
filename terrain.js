import { gl } from './game.js';

class Terrain {
	constructor() {
		this.terrPos = glMatrix.vec3.clone([Math.floor(Math.random() * 70 * 2),
			Math.floor(Math.random() * 70 * 1),
			-Math.floor(Math.random() * 20)]);
		glMatrix.vec3.add(this.terrPos, this.terrPos, [-60., -40., -20.]);
		this.color = [Math.random(), Math.random(), Math.random(), 1.];
	}
}

export { Terrain };