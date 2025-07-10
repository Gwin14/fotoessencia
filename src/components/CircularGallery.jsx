import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef } from "react";

import "./CircularGallery.css";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function createTextTexture(
  gl,
  text,
  font = "bold 30px monospace",
  color = "black"
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor = "#000000",
    font = "30px sans-serif",
  }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      fontFamily: this.font,
    });
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = "#000000",
      borderRadius = 0,
      font = "bold 30px Figtree",
      scrollSpeed = 2,
      scrollEase = 0.05,
    } = {}
  ) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      {
        image: `https://scontent-gru2-2.cdninstagram.com/v/t51.75761-15/504253021_17886443538274879_6533502630234172404_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=1-7&_nc_sid=18de74&_nc_ohc=hgYZVNkqHFcQ7kNvwGh9H4H&_nc_oc=AdnYSl79zOse6KTjys6QXgfz7N5ftBGUwb2XDvKCo3sFiBBcmrYaq-g_ZCuBg7DO4Pg&_nc_zt=23&_nc_ht=scontent-gru2-2.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfSnDA5cSrYhi6_N6WWelUfmNig9VnUt986gwn2egn2IMQ&oe=6875F620`,
        text: "Vida",
      },
      {
        image: `https://scontent-gru2-1.cdninstagram.com/v/t39.30808-6/499930506_122162367416506495_6158073018275670106_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=1-7&_nc_sid=18de74&_nc_ohc=l1aP6uNLDEcQ7kNvwErzn0i&_nc_oc=AdnY4J_KtbliXPo7eVZJase0KeJjU0XzdxM4PhKrVM19EpM4UIk6G_XEBkfTQD7hxA0&_nc_zt=23&_nc_ht=scontent-gru2-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfTS0PcZlSuWQi6zgDR_-5kenmnpoKVLih2wq0aOO-T1_g&oe=68760423`,
        text: "Viajens",
      },
      {
        image: `https://scontent-gru2-1.cdninstagram.com/v/t39.30808-6/497700082_122162366318506495_6408172322433122039_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=1-7&_nc_sid=18de74&_nc_ohc=ngCVKJemNKwQ7kNvwFfdMuh&_nc_oc=Adkjg4_gfa-oD4tJb57L8DsfrOGI9IzCjeAH4IZe1MPUOdXYgX0oSjwIfDHZruxQeCA&_nc_zt=23&_nc_ht=scontent-gru2-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfQZT5VNM45yVxfj9Lr7VyVnXeLPsqMvcFA7hmDdwuogXQ&oe=68761FEA`,
        text: "Momentos",
      },
      {
        image: `https://scontent-gru2-1.cdninstagram.com/v/t39.30808-6/486746747_122151791270506495_7723525962569739160_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ccb=1-7&_nc_sid=18de74&_nc_ohc=yFpssA7H8QcQ7kNvwHECzKj&_nc_oc=AdnQkQhRxD76QcPY-h5i_jzkyj2UINkXglcxioO2pOzh4lQ_qiOjlqqPxpJ5mMt__0c&_nc_zt=23&_nc_ht=scontent-gru2-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfR80wfmX3tuK5H5iAdN3zihbR7chpvpgevkD_ueJDCvlA&oe=6876070B`,
        text: "Cultura",
      },
      {
        image: `https://scontent-gru1-2.cdninstagram.com/v/t39.30808-6/483651687_122148455426506495_5172841116848340761_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ccb=1-7&_nc_sid=18de74&_nc_ohc=gDAXqq3bXjQQ7kNvwF440co&_nc_oc=AdkcJwfxlQU78oYAwefCoTYwUZK0uwaIXeMIu7G4ZVy8StIFoq3qlbq2V611QmlW9kE&_nc_zt=23&_nc_ht=scontent-gru1-2.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfRZIp27YBhSoIxIkbtHrL18bqWOy5kuCSyKAZz2w5z9jA&oe=68761C6A`,
        text: "Arte",
      },
      {
        image: `https://scontent-gru2-2.cdninstagram.com/v/t39.30808-6/481771144_122145599132506495_1943434319551853288_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=1-7&_nc_sid=18de74&_nc_ohc=_hMfNdKfqbQQ7kNvwFL0OkM&_nc_oc=AdnOTrpUOJCSdvreYzvL44E7l72iyCMCpwD_wGCN9KVREAViZSpW06aaqreQLG6TNI8&_nc_zt=23&_nc_ht=scontent-gru2-2.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfS8hMRSJfZPabU41Iiv0ukqrt4Ksa-ioZIZHuPdyP78rw&oe=6875F145`,
        text: "Segredos",
      },
      {
        image: `https://scontent-gru1-1.cdninstagram.com/v/t39.30808-6/475440251_122139455372506495_9122478657641102603_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ccb=1-7&_nc_sid=18de74&_nc_ohc=we9RT4KXA3MQ7kNvwHFAADn&_nc_oc=Adm2b8FfF9U5twYWnorumWVwwwmMGr4jTzvvrpi0SGLw5zFy9X-QUIg60SrGuLRaCoA&_nc_zt=23&_nc_ht=scontent-gru1-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfT0Ym1VPRIbgxX249Za2mor2xWE2DP-0PQFmPEQf-MRYg&oe=68761213`,
        text: "Expressão",
      },
      {
        image: `https://scontent-gru2-2.cdninstagram.com/v/t39.30808-6/470160370_122129967398506495_2134047396680411146_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=1-7&_nc_sid=18de74&_nc_ohc=wx1tKI5L3uEQ7kNvwG4inGZ&_nc_oc=AdkhcwcHnlywxIqhP0OHEF_akHtmzVnd2Fk0QpMa-oNdIK5eCcyLNrHi3RffeTu4Yz0&_nc_zt=23&_nc_ht=scontent-gru2-2.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfTWy5Mh9V0E-NDuvAwLA4tD-1XkuoWakey-yDb2IWnAJg&oe=6875F360`,
        text: "Sentimentos",
      },
      {
        image: `https://scontent-gru2-1.cdninstagram.com/v/t39.30808-6/470232337_122131576208506495_6461297611262040642_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=1-7&_nc_sid=18de74&_nc_ohc=sOLy6DNbzAUQ7kNvwHkWMBk&_nc_oc=AdkU1j7Mw_nKSeHN-lXMewYg6yVLgNvRpKQ3temvpYhq_mhbxeZvHcplGv8xkGF7E5s&_nc_zt=23&_nc_ht=scontent-gru2-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfQRNpdbGZLSBcdaVzbm9H3phJuw7OywcKDUcMGQq5HCXg&oe=68761A6B`,
        text: "Perspectiva",
      },
      {
        image: `https://scontent-gru2-1.cdninstagram.com/v/t39.30808-6/470139212_122129954594506495_541141891755545800_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=1-7&_nc_sid=18de74&_nc_ohc=PY8OxmiAcOcQ7kNvwFvcbCJ&_nc_oc=AdnsFRKavyA2kRLK1lSqRH69n5i1_A3hCppcknrDVlN6P9nfgA3nQwrstylHKD7V3H0&_nc_zt=23&_nc_ht=scontent-gru2-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfR0PCnOfm9bhJQQ_xM7po7J7BRPypsjaGZ042E30InGSQ&oe=6875FDE5`,
        text: "Cores",
      },
      {
        image: `https://scontent-gru1-2.cdninstagram.com/v/t39.30808-6/469840482_122129237900506495_2264446898146135321_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ccb=1-7&_nc_sid=18de74&_nc_ohc=0tNq_RSP2lcQ7kNvwEUY8vd&_nc_oc=AdkZfna-n4_aqkvzxtbA3wpve_oTjxCPGrAMxyv962GMpit1nr9iLJLb-VGjV7ljlJM&_nc_zt=23&_nc_ht=scontent-gru1-2.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfS_LxrO3fjTDopakSXK9sbKNRrLMJgCfx1Zxfg2XNEYvA&oe=68761BAB`,
        text: "Histórias",
      },
      {
        image: `https://scontent-gru2-2.cdninstagram.com/v/t39.30808-6/469399879_122128598480506495_745891567318763659_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ccb=1-7&_nc_sid=18de74&_nc_ohc=oCZ2XTNufZQQ7kNvwFqjuHG&_nc_oc=AdlqlDmnjN7ysk84QPS4XlBDZs0z4UUEr2VZhDQuwCIYzs57sGHrdmYQVW8umF0RWvw&_nc_zt=23&_nc_ht=scontent-gru2-2.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=NjVCPasbLURzsU8NoFXI0g&oh=00_AfQ1jrpfm60qxAVI4-BNCmbiQLiNBZUmnJRVudbCdywkzQ&oe=6876007D`,
        text: "Aventuras",
      },
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }
  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target +=
      (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }
  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("mousewheel", this.boundOnWheel);
    window.addEventListener("wheel", this.boundOnWheel);
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousewheel", this.boundOnWheel);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#000000",
  borderRadius = 0.05,
  font = "bold 30px Figtree",
  scrollSpeed = 2,
  scrollEase = 0.05,
}) {
  const containerRef = useRef(null);
  useEffect(() => {
    const app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    });
    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);
  return <div className="circular-gallery" ref={containerRef} />;
}
