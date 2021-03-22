var canvas = document.querySelector(".canvas");
var ctx = canvas.getContext("2d");
var input = document.querySelector(".input");
var btnNext = document.querySelector(".btn_next");
var btnSubmit = document.querySelector(".btn_submit");
var btnClear = document.querySelector(".btn_clear");
var spanPerimeter = document.querySelector(".text__span_perimeter");
var spanArea = document.querySelector(".text__span_area");
// fixing self-scaling and blur effect of canvas
ctx.translate(0.5, 0.5);
canvas.width = 2280;
canvas.height = 1400;
canvas.style.width = "1140px";
canvas.style.height = "700px";
ctx.scale(2, 2);
var canvCoordX = canvas.getBoundingClientRect().left;
var canvCoordY = canvas.getBoundingClientRect().top;
ctx.lineWidth = 2;
ctx.strokeStyle = "purple";
var flag = false;
var apexes = [];
function getDataFromMouse() {
    canvas.addEventListener("mousedown", function (e) {
        if (flag || apexes.length > 100)
            return;
        input.disabled = true;
        btnNext.disabled = true;
        e.preventDefault();
        e.stopPropagation();
        var coords = {
            x: e.clientX - canvCoordX,
            y: e.clientY - canvCoordY
        };
        apexes.push(coords);
        drawShape();
    });
}
btnSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    btnNext.disabled = true;
    setData(calculate());
});
btnClear.addEventListener("click", function (e) {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    apexes = [];
    input.disabled = false;
    btnNext.disabled = false;
    spanPerimeter.innerText = '';
    spanArea.innerText = '';
    getDataFromInput();
    getDataFromMouse();
});
function drawShape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(apexes[0].x, apexes[0].y);
    for (var i = 1; i < apexes.length; i++) {
        ctx.lineTo(apexes[i].x, apexes[i].y);
    }
    ctx.closePath();
    ctx.stroke();
}
function getDataFromInput() {
    input.disabled = false;
    btnNext.disabled = false;
    var regex = new RegExp("^d+,s*d+$");
    btnNext.addEventListener("click", function (e) {
        e.preventDefault();
        if (input.value !== "" || regex.test(input.value)) {
            var coord = {
                x: parseInt(input.value.split(",")[0].trim()),
                y: parseInt(input.value.split(",")[1].trim())
            };
            apexes.push(coord);
            input.value = '';
            drawShape();
        }
    });
}
function setData(obj) {
    if (obj === undefined) {
        alert('Specify coordinates of at least 3 apexes for further calculations!');
        return;
    }
    spanPerimeter.innerText = String(obj.perimeter) + 'px';
    spanArea.innerText = String(obj.area) + 'sq.px';
}
function calculate() {
    var perimeter = 0;
    var area = 0;
    var xArr = [];
    var yArr = [];
    if (apexes.length < 3)
        return;
    for (var i = 0; i < apexes.length; i++) {
        xArr.push(apexes[i].x);
        yArr.push(apexes[i].y);
    }
    for (var j = 0; j < apexes.length - 1; j++) {
        var deltaX = xArr[j + 1] - xArr[j];
        var deltaY = yArr[j + 1] - yArr[j];
        if (deltaX !== NaN || deltaY !== NaN) {
            perimeter += Math.pow(deltaX * deltaX + deltaY * deltaY, 0.5);
        }
    }
    for (var k = 0; k < apexes.length - 1; k++) {
        var deltaX = xArr[k + 1] - xArr[k];
        var deltaY = yArr[k + 1] - yArr[k];
        area += xArr[k] * deltaY - yArr[k] * deltaX;
    }
    area *= 0.5;
    var results = {
        perimeter: Math.round(Math.abs(perimeter)),
        area: Math.round(Math.abs(area))
    };
    return results;
}
getDataFromInput();
getDataFromMouse();
