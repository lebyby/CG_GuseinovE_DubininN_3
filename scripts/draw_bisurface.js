let canv = document.getElementById("canvas");
let ctx = canv.getContext('2d');
canv.width = 755;
canv.height = 700;

let X = [];
X.push(document.getElementById("x1Text"));
X.push(document.getElementById("x2Text"));
X.push(document.getElementById("x3Text"));
X.push(document.getElementById("x4Text"));

let Y = [];
Y.push(document.getElementById("y1Text"));
Y.push(document.getElementById("y2Text"));
Y.push(document.getElementById("y3Text"));
Y.push(document.getElementById("y4Text"));

let Z = [];
Z.push(document.getElementById("z1Text"));
Z.push(document.getElementById("z2Text"));
Z.push(document.getElementById("z3Text"));
Z.push(document.getElementById("z4Text"));

xDegreeText1 = document.getElementById("xDegreeText");
yDegreeText1 = document.getElementById("yDegreeText");

let grd=ctx.createLinearGradient(0,0,0,700);
grd.addColorStop(0,'#ffc044');
grd.addColorStop(1,'#5a1083');

draw(ctx, X, Y, Z, xDegreeText1, yDegreeText1);

function draw(ctx, X, Y, Z, xDegreeText1, yDegreeText1) {
    ctx.clearRect(0, 0, canv.width, canv.height);

    let teta = parseInt(xDegreeText1.value);
    let tetta = parseInt(yDegreeText1.value);
    let points = [[parseInt(X[0].value),
        parseInt(Y[0].value),
        parseInt(Z[0].value)],
        [parseInt(X[1].value), parseInt(Y[1].value), parseInt(Z[1].value)],
        [parseInt(X[2].value), parseInt(Y[2].value), parseInt(Z[2].value)],
        [parseInt(X[3].value), parseInt(Y[3].value), parseInt(Z[3].value)]];
    let us = [];
    let ws = [];
    us = lineSpace(0, 1, 11);
    ws = lineSpace(0, 1, 11);
    let surface_points = [];
    for(let i = 0; i < us.length; i++){
        surface_points.push([]);
        let first_time = true;
        for(let j = 0; j < ws.length; j++){
            let Q = [];
            for(let t = 0; t < 3; t++){
                Q.push(points[0][t] * (1 - us[i]) * (1 - ws[j]) + points[1][t] * us[i] * (1 - ws[j]));

                Q[t] += points[2][t] * (1 - us[i]) * ws[j] + points[3][t] * us[i] * ws[j];
            }
            if(!first_time){
                showLine(Q, surface_points[i][surface_points[i].length - 1]);

            }else{
                first_time = false;
            }
            surface_points[i].push(Q);
        }
    }
    for(let j = 0; j < surface_points.length; j++){
        for(let i = 0; i < surface_points.length - 1; i++){
            showLine(surface_points[i][j], surface_points[i+1][j]);
        }
    }
    ctx.clearRect(0, 0, canv.width, canv.height);
    let ort = getOrt(points);
    surface_points = Spin(surface_points, ort, teta, [1, 0, 0]);
    surface_points = Spin(surface_points, ort, tetta, [0, 1, 0]);
    showSurface(surface_points);
}

function showSurface(line2d){
    for(let i = 0; i < line2d.length; i++){
        for(let j = 0; j < line2d.length; j++){
            if(i !== line2d.length - 1){
                showLine(line2d[i][j], line2d[i + 1][j]);
            }
            if(j !== line2d.length - 1){
                showLine(line2d[i][j], line2d[i][j + 1]);
            }
            if(j !== line2d.length - 1 && i !== line2d.length - 1){
                fillSur(line2d[i][j], line2d[i][j + 1], line2d[i + 1][j], line2d[i + 1][j + 1]);
                showLetter(line2d[0][0], line2d[0][line2d.length - 1], line2d[line2d.length - 1][0], line2d[line2d.length - 1][line2d.length - 1])
            }
        }
    }
}

function showLine(ij, i1j1){
    let ij_t = transform3d(ij);
    let i1j1_t = transform3d(i1j1);

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.moveTo(ij_t[0], ij_t[1]);
    ctx.lineTo(i1j1_t[0], i1j1_t[1]);
    ctx.stroke();
    ctx.closePath();
}

function fillSur(ij, ij1, i1j, i1j1){
    let ij_t = transform3d(ij);
    let ij1_t = transform3d(ij1);
    let i1j_t = transform3d(i1j);
    let i1j1_t = transform3d(i1j1);

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(ij_t[0], ij_t[1]);
    ctx.lineTo(ij1_t[0], ij1_t[1]);
    ctx.lineTo(i1j1_t[0], i1j1_t[1]);
    ctx.lineTo(i1j_t[0], i1j_t[1]);
    ctx.fill();
}

function showLetter(ij, ij1, i1j, i1j1) {
    let ij_t = transform3d(ij);
    let ij1_t = transform3d(ij1);
    let i1j_t = transform3d(i1j);
    let i1j1_t = transform3d(i1j1);

    ctx.beginPath(); 
    ctx.font = "35px JetBrainsMono Regular";
    ctx.fillStyle="#d63a0b";
    ctx.fillText("A", ij_t[0] + 10, ij_t[1]-10);
    ctx.fillText("C", ij1_t[0] + 10, ij1_t[1] - 10);
    ctx.fillText("D", i1j1_t[0] + 10, i1j1_t[1] + 10);
    ctx.fillText("B", i1j_t[0] + 10, i1j_t[1] - 10);
    ctx.stroke();
    ctx.closePath();
}

function lineSpace(a, b, n) {
    if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
    if (n < 2) {
        return n === 1 ? [a] : [];
    }
    let arr = Array(n);
    n--;
    for (let i = n; i >= 0; i--) {
        arr[i] = (i * b + (n - i) * a) / n;
    }
    return arr;
}

function toRadians (rad) {
    return rad * (Math.PI / 180);
}

function getRotationMatrix(ort, teta){

    let x = ort[0];
    let y = ort[1];
    let z = ort[2];
    let cos = Math.cos(toRadians(teta));
    let sin = Math.sin(toRadians(teta));

    return [[cos + (1 - cos) * x ** 2,
        (1 - cos) * x * y - sin * z,
        (1 - cos) * x * z + sin * y],

        [(1 - cos) * x * y + sin * z,
            cos + (1 - cos) * y ** 2,
            (1 - cos) * y * z - sin * x],

        [(1 - cos) * z * x - sin * y,
            (1 - cos) * z * y + sin * x,
            cos + (1 - cos) * z ** 2]];
}

function getOrt(base_points){
    let maxi = [];
    let mini = [];
    for(let j = 0; j < 3; j++){
        let max = -100000;
        let min = 100000;
        for(let i = 0; i < 4; i++){
            if (parseInt(base_points[i][j]) < min){
                min = parseInt(base_points[i][j], 10);
            }
            if (parseInt(base_points[i][j]) > max){
                max = parseInt(base_points[i][j]);
            }
        }
        maxi.push(max);
        mini.push(min);
    }
    let result = [];
    for(let i = 0; i < maxi.length; i++){
        result.push((maxi[i] + mini[i])/2);
    }
    return result;
}

function Spin(line2d, ort, teta, mat)
{
    let matrix = getRotationMatrix(mat, teta);
    let center = ort;
    let new_line2d = [];
    for(let i = 0; i < line2d.length; i++)
    {
        new_line2d.push([]);
        for(let j = 0; j < line2d.length; j++){
            let matrixNew = [];
            for(let t = 0; t < center.length; t++){
                let vvv = line2d[i][j][t] - center[t];
                matrixNew.push(vvv);
            }
            let matrixNewNew = [];
            matrixNewNew[0] = matrix[0][0]*matrixNew[0] + matrix[0][1]*matrixNew[1] + matrix[0][2]*matrixNew[2];
            matrixNewNew[1] = matrix[1][0]*matrixNew[0] + matrix[1][1]*matrixNew[1] + matrix[1][2]*matrixNew[2];
            matrixNewNew[2] = matrix[2][0]*matrixNew[0] + matrix[2][1]*matrixNew[1] + matrix[2][2]*matrixNew[2];
            for(let t = 0; t < 3; t++){
                matrixNewNew[t] = matrixNewNew[t] + center[t];
            }
            new_line2d[i].push(matrixNewNew);
        }
    }
    console.log(new_line2d);
    return new_line2d;
}

function transform3d(point){
    return [(point[0] / ((1200 - point[2]) / 1000 + 1)), (point[1] / ((1200 - point[2]) / 1000 + 1))];
}


