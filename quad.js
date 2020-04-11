import { gl } from './game.js';

class Quad {
	constructor(shader) {
		this.shader = shader;
		const position = gl.getAttribLocation(this.shader.program, 'a_position');

		this.transfromationLocation = gl.getUniformLocation(this.shader.program, 'u_transformMatrix');
		this.viewLocation = gl.getUniformLocation(this.shader.program, 'u_viewMatrix');
		this.texcoordLocation = gl.getUniformLocation(this.shader.program, 'u_textureMatrix');
		this.cameraLocation = gl.getUniformLocation(this.shader.program, 'u_cameraMatrix');
		this.colorLocation = gl.getUniformLocation(this.shader.program, 'u_color');

		gl.useProgram(this.shader.program);

		const positionBuffer = gl.createBuffer();
		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.enableVertexAttribArray(position);
		const vertexData = new Float32Array([
			0.0, 0.0, 0.0,
			0.0, 1.0, 0.0,
			1.0, 1.0, 0.0,
			1.0, 0.0, 0.0
		]);
		gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);


		const indexData = new Uint16Array([0, 1, 2, 0, 2, 3]);
		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

		gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
	}

	setTexture = (texture) => {
		this.texture = texture;
		gl.bindTexture(gl.TEXTURE_2D, texture.texture);
	}

	setCamera = (viewMatrix, cameraMatrix) => {
		gl.uniformMatrix4fv(this.viewLocation, false, viewMatrix);
		gl.uniformMatrix4fv(this.cameraLocation, false, cameraMatrix);
	}

	render = (pos, w, h, u, v, color) => {
		const transformMatrix = glMatrix.mat4.create();
		const textureMatrix = glMatrix.mat4.create();

		glMatrix.mat4.translate(transformMatrix, transformMatrix, pos);
		glMatrix.mat4.scale(transformMatrix, transformMatrix, [w, h, 0.0]);
		gl.uniformMatrix4fv(this.transfromationLocation, false, transformMatrix);

		glMatrix.mat4.scale(textureMatrix, textureMatrix, [1 / this.texture.width, 1 / this.texture.height, 0.0]);
		glMatrix.mat4.translate(textureMatrix, textureMatrix, [u, v, 0.0]);
		glMatrix.mat4.scale(textureMatrix, textureMatrix, [w, h, 0]);
		gl.uniformMatrix4fv(this.texcoordLocation, false, textureMatrix);

		gl.uniform4fv(this.colorLocation,  color);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
	}
}

export { Quad };