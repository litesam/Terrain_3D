import { gl } from './game.js';

class CompileShader {
	constructor(code, type) {
		this.shader = gl.createShader(type);
		gl.shaderSource(this.shader, code);
		gl.compileShader(this.shader);
		if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
			throw new Error(gl.getShaderInfoLog(this.shader));
		}
	}
}

class VertexShader extends CompileShader {
	constructor(code) {
		super(code, gl.VERTEX_SHADER);
	}
}

class FragmentShader extends CompileShader {
	constructor(code) {
		super(code, gl.FRAGMENT_SHADER);
	}
}

class Shader {
	constructor(vs, fs) {
		const vShader = new VertexShader(vs).shader;
		const fShader = new FragmentShader(fs).shader;
		this.program = gl.createProgram();
		gl.attachShader(this.program, vShader);
		gl.attachShader(this.program, fShader);
		gl.linkProgram(this.program);

		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(this.program));
		}
	}
}

const vsCode = `
#version 300 es
precision highp float;

in vec4 a_position;

uniform mat4 u_transformMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_cameraMatrix;

uniform mat4 u_textureMatrix;

out vec2 v_texCoord;

void main() {
	v_texCoord = (u_textureMatrix * a_position).xy;
	gl_Position = u_viewMatrix * u_cameraMatrix * u_transformMatrix * vec4(a_position.xyz, 1.0);
}
`.slice(1);
const fsCode = `
#version 300 es
precision highp float;

uniform vec4 u_color;
uniform sampler2D u_image;

in vec2 v_texCoord;

out vec4 outColor;

void main() {
	outColor = u_color;
}
`.slice(1);

export { Shader, vsCode, fsCode };