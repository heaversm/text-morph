import { gsap, Power4, Circ } from "gsap";

let leon, canvas, ctx;

const sw = document.body.clientWidth;
const sh = document.body.clientHeight;
const pixelRatio = 2;

const $container = document.querySelector(".container");

let container, texture, particleCon, control;
const particleTotal = 3000;
let particles = [];

function init() {
  generatePixi(0x000000, ".container");
  texture = PIXI.Texture.from("drop-alpha.png");
  particleCon = new PIXI.ParticleContainer(particleTotal, {
    vertices: false,
    scale: true,
    position: true,
    rotation: false,
    uvs: false,
    alpha: false,
  });
  stage.addChild(particleCon);

  let p, i;
  for (i = 0; i < particleTotal; i++) {
    p = new PIXI.Sprite(texture);
    p.x = sw / 2;
    p.y = sh / 2;
    p.anchor.set(0.5);
    p.scale.x = p.scale.y = 0;
    particleCon.addChild(p);
    particles.push(p);
  }

  const blurFilter = new PIXI.filters.BlurFilter();
  blurFilter.blur = 10;
  blurFilter.autoFit = true;

  const fragSource = [
    "precision mediump float;",
    "varying vec2 vTextureCoord;",
    "uniform sampler2D uSampler;",
    "uniform float threshold;",
    "uniform float mr;",
    "uniform float mg;",
    "uniform float mb;",
    "void main(void)",
    "{",
    "    vec4 color = texture2D(uSampler, vTextureCoord);",
    "    vec3 mcolor = vec3(mr, mg, mb);",
    "    if (color.a > threshold) {",
    "       gl_FragColor = vec4(mcolor, 1.0);",
    "    } else {",
    "       gl_FragColor = vec4(vec3(0.0), 0.0);",
    "    }",
    "}",
  ].join("\n");

  renderer.backgroundColor = 0xffffff;

  const uniformsData = {
    threshold: 0.5,
    mr: 0.0 / 255.0,
    mg: 0.0 / 255.0,
    mb: 0.0 / 255.0,
  };

  const thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);
  stage.filters = [blurFilter, thresholdFilter];
  stage.filterArea = renderer.screen;

  control = {
    weight: 9,
    color: {},
    outline: true,
    drawing: () => {
      let i;
      for (i = 0; i < particleTotal; i++) {
        gsap.killTweensOf(particles[i].scale);
        gsap.set(particles[i].scale, {
          x: 0,
          y: 0,
        });
        gsap.to(particles[i].scale, 3, {
          delay: 0.001 * i,
          x: particles[i].saveScale,
          y: particles[i].saveScale,
          ease: Circ.easeOut,
        });
      }
    },
  };

  leon = new LeonSans({
    text: "dft",
    size: getSize(400),
    weight: 900,
    pathGap: -1,
    isPath: true,
    tracking: 0,
  });

  leon.on("update", (model) => {
    update();
  });

  requestAnimationFrame(animate);

  gsap.delayedCall(0.1, () => {
    control.drawing();
  });
}

function update() {
  const total = leon.paths.length;
  const sw2 = sw / 2;
  const sh2 = sh / 2;
  let i, p, pos, scale;
  for (i = 0; i < particleTotal; i++) {
    p = particles[i];
    gsap.killTweensOf(p.scale);
    if (i < total) {
      pos = leon.paths[i];
      if (pos.type == "a") {
        scale = control.weight * 0.025 * leon.scale;
      } else {
        scale = control.weight * 0.01 * leon.scale;
      }
      p.saveScale = scale;
      p.x = pos.x;
      p.y = pos.y;
      p.scale.x = p.scale.y = scale;
    } else {
      p.saveScale = 0;
      p.x = -1000;
      p.y = -1000;
      p.scale.x = p.scale.y = 0;
    }
  }
}

function animate(t) {
  requestAnimationFrame(animate);

  const x = (sw - leon.rect.w) / 2;
  const y = (sh - leon.rect.h) / 2;
  leon.position(x, y);

  renderer.render(stage);
}

window.onload = () => {
  init();
};
