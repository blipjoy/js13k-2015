// Procedural texture generation
m = 1024
var ctx = document.createElement("canvas").getContext("2d")
ctx.canvas.width = ctx.canvas.height = m
var img = ctx.createImageData(m, m)

// XXX: <DEBUG>
document.body.firstChild.style.display = "none"
document.body.appendChild(ctx.canvas)
// XXX: </DEBUG>



// Setup initial fractal state
d[0][0] = d[0][n] = d[n][0] = d[n][n] = .3 // Corners
diamond(0, 0, n, 2, height) // Center
square(0, 0, n, 2, height)

// Empty worker queue
while (q.length) {
    square.apply(square, q.shift())
}



// RENDER CLOUDS
tmp = 0
for (var y = 0; y < m; y++) {
    for (var x = 0; x < m; x++) {
        // Interpolate between each node
        var sx = x / m * n
        var sy = y / m * n

        var p1 = d[~~sx][~~sy]
        var p2 = d[~~sx + 1][~~sy]
        var p3 = d[~~sx][~~sy + 1]
        var p4 = d[~~sx + 1][~~sy + 1]

        var h = (
            (p1 + (p2 - p1) * (sx % 1)) * (1 - sy % 1) +
            (p1 + (p3 - p1) * (sy % 1)) * (1 - sx % 1) +
            (p3 + (p4 - p3) * (sx % 1)) * (sy % 1) +
            (p2 + (p4 - p2) * (sy % 1)) * (sx % 1)
        ) / 2

        // Choose a color based on node height
        img.data[tmp++] = 102 + h * 118 // 102 -> 220
        img.data[tmp++] = 145 + h * 55 // 145 -> 200
        img.data[tmp++] = 220
        img.data[tmp++] = 255
    }
}
ctx.putImageData(img, 0, 0)



// Reinitialize fractal state
d[0][0] = d[0][n] = d[n][0] = d[n][n] = 0 // Corners
diamond(0, 0, n, 2, height) // Center
square(0, 0, n, 2, height)

// Empty worker queue
while (q.length) {
    square.apply(square, q.shift())
}



// RENDER MOUNTAINS
for (var y = 0; y <= n; y++) {
    ctx.beginPath()

    // Choose a color based on depth
    // FIXME: Use fragment shader to add fog (based on depth)
    ctx.fillStyle =
        "rgb(" +
        ~~((n - y * .4) / n * 200) + "," +
        ~~((n - y * .6) / n * 184) + "," +
        "222)"

    ctx.moveTo(0, m)

    for (var x = 0; x <= n; x++) {
        // When (y == 0): highest point scaled to 0.4, lowest scaled to 0.8
        // When (y == n): highest point scaled to 0.7, lowest scaled to 0.9
        ctx.lineTo(x / n * m,
            (
                (1 - d[x][y]) *
                (((n - y) / n) * .4 + (y / n) * .2) +
                (((n - y) / n) * .4 + (y / n) * .7)
            ) * m
        )
    }

    ctx.lineTo(m, m)
    ctx.fill()
}
