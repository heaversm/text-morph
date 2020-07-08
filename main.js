import { gsap, Power4 } from "gsap";

let leon, canvas, ctx;

const sw = document.body.clientWidth;
const sh = document.body.clientHeight;
const pixelRatio = 2;

const $container = document.querySelector('.container');

function init() {
    canvas = document.createElement('canvas');
    $container.appendChild(canvas);
    ctx = canvas.getContext("2d");

    canvas.width = sw * pixelRatio;
    canvas.height = sh * pixelRatio;
    //canvas.style.width = sw + 'px';
    //canvas.style.height = sh + 'px';
    canvas.className = 'text-canvas';
    ctx.scale(pixelRatio, pixelRatio);
    

    leon = new LeonSans({
        text: 'digital futures told',
        color: ['#000000'],
        size: 80,
        weight: 200
    });

    requestAnimationFrame(animate);

    initDrawing();

}

function initDrawing(){
    let i, total = leon.drawing.length;
    for (i = 0; i < total; i++) {
        gsap.fromTo(leon.drawing[i], 1.6, {
            value: 0
        }, {
            delay: i * 0.05,
            value: 1,
            ease: Power4.easeOut
        });
    }
}

function animate(t) {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, sw, sh);

    const x = (sw - leon.rect.w) / 2;
    const y = (sh - leon.rect.h) / 2;
    leon.position(x, y);

    leon.draw(ctx);
}

window.onload = () => {
    init();
};