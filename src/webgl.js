// Initialize WebGL
var gl = document.body.firstChild.getContext("webgl", { alpha: 0 })

// Hash all WebGL methods
// See Gruntfile.js for hash replacements
var tmp = []
for (i in gl) {
// XXX: <DEBUG>
    // Workaround a bug in WebGL Inspector
    // See: https://github.com/benvanik/WebGL-Inspector/issues/134
    gl[i] &&
// XXX: </DEBUG>

    // First, filter the methods into an array
    gl[i].bind && tmp.push(i)
}
for (i in tmp.sort()) {
    // Then map the sorted methods into the array
    gl[i] = gl[tmp[i]].bind(gl)
}

// Build the shader program
var handle = gl.createProgram()

tmp = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(tmp, document.body.children[1].innerHTML)
gl.compileShader(tmp)
gl.attachShader(handle, tmp)

// XXX: <DEBUG>
if (!gl.getShaderParameter(tmp, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(tmp)
}
// XXX: </DEBUG>

tmp = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(tmp, document.body.children[2].innerHTML)
gl.compileShader(tmp)
gl.attachShader(handle, tmp)

// XXX: <DEBUG>
if (!gl.getShaderParameter(tmp, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(tmp)
}
// XXX: </DEBUG>

gl.linkProgram(handle)

// XXX: <DEBUG>
if (!gl.getProgramParameter(handle, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(handle)
}
// XXX: </DEBUG>

gl.useProgram(handle)


// Initialize background color (default is white)
gl.clearColor(102 / 255, 145 / 255, 220 / 255, 1)

// Enable blending
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);


// Initialize attribute variables
gl.vertexAttribPointer(
    gl.getAttribLocation(handle, "c"),
    2, // Number of floats
    gl.FLOAT,
    gl.vertexAttribPointer(
        gl.getAttribLocation(handle, "u"),
        2, // Number of floats
        gl.FLOAT,
        gl.enableVertexAttribArray(gl.vertexAttribPointer(
            gl.getAttribLocation(handle, "v"),
            3, // Number of floats
            gl.FLOAT,
            gl.enableVertexAttribArray(1),
            36, // Stride: (4 + 3 + 2) * 4
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()) // Offset: 0 * 4
        )),
        36, // Stride: (4 + 3 + 2) * 4
        12  // Offset: 3 * 4
    ),
    36, // Stride: (4 + 3 + 2) * 4
    20  // Offset: (3 + 2) * 4
)
gl.enableVertexAttribArray(2)


// Initialize uniform variables
m = gl.getUniformLocation(handle, "m") // This is my view matrix pointer
v = new Float32Array(16) // This is my view matrix

function resize_canvas() {
    if (
        gl.canvas.width != gl.canvas.clientWidth ||
        gl.canvas.height != gl.canvas.clientHeight
    ) {
        gl.viewport(
            0,
            0,
            gl.canvas.width = gl.canvas.clientWidth,
            gl.canvas.height = gl.canvas.clientHeight
        )

        gl.uniformMatrix4fv(
            gl.getUniformLocation(handle, "p"),
            0,
            // Perspective projection matrix: http://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html
            // FOV = 90° == (Math.PI / 2) RAD
            // near = 1
            // far = 50
            new Float32Array([
                Math.tan(Math.PI * .5 - .5 * (Math.PI / 2)) / (gl.canvas.clientWidth / gl.canvas.clientHeight), 0, 0, 0,
                0, Math.tan(Math.PI * .5 - .5 * (Math.PI / 2)), 0, 0,
                0, 0, (1 + 50) * (1.0 / (1 - 50)), -1,
                0, 0, 1 * 50 * (1.0 / (1 - 50)) * 2, 0
            ])
        )
    }
}

/*
// Set texture sampler
gl.uniform1i(
    s = gl.getUniformLocation(handle, "s"),
    0 // default is 0... I'll just save this here for later...
)
*/
