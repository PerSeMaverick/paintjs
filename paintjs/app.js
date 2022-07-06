const canvas = document.querySelector('#jsCanvas');
const ctx = canvas.getContext('2d'); // canvas의 context에 접근하려면 반드시 추가하는 요소
const colors = document.getElementsByClassName('jsColor'); // querySelector는 수 많은 컬러 div중 오직 맨 처음 하나의 div만 선택한다.
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const save = document.getElementById("jsSave");

const INITIAL_COLOR = '#2c2c2c';
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        /*1. 선을 그리기 위해서는 어디서 선 그리기를 시작해야 하는지 알려줘야 한다.
            1-1. beginPath()로 시작 경로를 만들겠다고 알린 뒤, moveTo(x,y)를 통해 시작 위치를 잡아준다.
            1-2. 결과적으로 언제든지 마우스 위치에서 그리기를 시작할 준비가 된 상태가 만들어지게 된다.*/
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        /* mousedown > startPainting 작동 > painting = true
        이 부분의 코드는 마우스가 움직이는 내내 발생하게 되는 것이다.
        2. 선을 그리려면 이전 위치에서 어디까지 그릴 것인지를 알려줘야 한다.
            2-1. lineTo(x, y)를 통해 어디까지 그릴 것인지를 알려주고 선을 그린다. (보이지 않는 선)
            2-2. stroke()를 통해 [윤곽선]으로 도형을 그린다. (보이는 도형, 이것이 길게 이어져 선처럼 보인다)
            2-3. lineTo는 드로잉이 끝난 위치를 자동으로 시작점으로 업데이트 하기 때문에,
             그리는 중에는 자동으로 마우스의 위치가 추적되면서 윤곽선으로 그림을 그릴 수 있게 된다.*/
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function onRangeChange(event) {
    const strokeSize = event.target.value;
    ctx.lineWidth = strokeSize;
}

function onModeClick(event) {
    if (filling === true) {
        filling = false;
        event.target.innerText = 'FILL';

    } else {
        filling = true;
        event.target.innerText = 'PAINT';

    }
}

function onSaveClick() {
    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image; // href는 image가 되어야하고
    link.download = 'PaintJS[🖌️]'; // download는 이름이 되어야 함
    link.click();
}

function onFillCanvas() {
    if (filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function onContextMenu(event) {
    event.preventDefault();
}

if (canvas) {
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mouseleave', stopPainting);
    canvas.addEventListener('click', onFillCanvas);
    canvas.addEventListener('contextmenu', onContextMenu);
}

// array.from는 object로부터 array를 만든다.
Array.from(colors).forEach(color =>
    color.addEventListener("click", onColorClick));

if (range) {
    range.addEventListener("input", onRangeChange);
}

if (mode) {
    mode.addEventListener("click", onModeClick);
}

if (save) {
    save.addEventListener("click", onSaveClick);
}