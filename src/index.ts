const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const input = document.querySelector(".input") as HTMLInputElement;
const btnNext = document.querySelector(".btn_next") as HTMLButtonElement;
const btnSubmit = document.querySelector(".btn_submit") as HTMLButtonElement;
const btnClear = document.querySelector(".btn_clear") as HTMLButtonElement;
const spanPerimeter = document.querySelector(".text__span_perimeter") as HTMLSpanElement;
const spanArea = document.querySelector(".text__span_area") as HTMLSpanElement;

// fixing self-scaling and blur effect of canvas
ctx.translate(0.5, 0.5);
canvas.width = 2280;
canvas.height = 1400;
canvas.style.width = "1140px";
canvas.style.height = "700px";
ctx.scale(2, 2);

const canvCoordX: number = canvas.getBoundingClientRect().left;
const canvCoordY: number = canvas.getBoundingClientRect().top;
ctx.lineWidth = 2;
ctx.strokeStyle = "purple";
let flag: boolean = false;

interface Coordinates {
  x: number;
  y: number;
}
let apexes: Coordinates[] = [];

interface Results {
    perimeter: number;
    area: number;
}

function getDataFromMouse(): void {
  canvas.addEventListener("mousedown", (e: MouseEvent): void => {
    if (flag || apexes.length > 100) return;

    input.disabled = true;
    btnNext.disabled = true;

    e.preventDefault();
    e.stopPropagation();

    const coords: Coordinates = {
      x: e.clientX - canvCoordX,
      y: e.clientY - canvCoordY,
    };
    apexes.push(coords);
    drawShape();
  });
}

btnSubmit.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  btnNext.disabled = true;
  setData(calculate());
});

btnClear.addEventListener("click", (e: MouseEvent) => {
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

function drawShape(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(apexes[0].x, apexes[0].y);

  for (let i: number = 1; i < apexes.length; i++) {
    ctx.lineTo(apexes[i].x, apexes[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

function getDataFromInput(): void {
  input.disabled = false;
  btnNext.disabled = false;
  const regex: any = new RegExp("^d+,s*d+$");

  btnNext.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    if (input.value !== "" || regex.test(input.value)) {
      const coord: Coordinates = {
        x: parseInt(input.value.split(",")[0].trim()),
        y: parseInt(input.value.split(",")[1].trim()),
      };
      apexes.push(coord);
      input.value = '';
      drawShape();
    }
  });
}

function setData<T extends Results | undefined>(obj: T): void {
    if (obj === undefined) {
        alert('Specify coordinates of at least 3 apexes for further calculations!');
        return;
    }
    spanPerimeter.innerText = String(obj.perimeter) + 'px';
    spanArea.innerText = String(obj.area) + 'sq.px';
} 

function calculate(): Results | undefined {
    let perimeter: number = 0;
    let area: number = 0;
    let xArr: Array<number> = [];
    let yArr: Array<number> = [];

    if (apexes.length < 3) return;

    for (let i: number = 0; i < apexes.length; i++) {
        xArr.push(apexes[i].x);
        yArr.push(apexes[i].y);
    }

    for (let j: number = 0; j < apexes.length - 1; j++ ) {
        let deltaX = xArr[j+1] - xArr[j];
        let deltaY = yArr[j+1] - yArr[j];
        if (deltaX !== NaN || deltaY !== NaN) {
            perimeter += Math.pow(deltaX * deltaX + deltaY * deltaY, 0.5);
        }
    }

    for(let k: number = 0; k < apexes.length - 1; k++ ) {
        let deltaX = xArr[k+1] - xArr[k];
        let deltaY = yArr[k+1] - yArr[k];
        area += xArr[k] * deltaY - yArr[k] * deltaX;
    }
    area *= 0.5;

    const results: Results = {
        perimeter: Math.round(Math.abs(perimeter)),
        area: Math.round(Math.abs(area))
    }

    return results;
}

getDataFromInput();
getDataFromMouse();
