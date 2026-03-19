import { gsap } from "gsap";
import { getLocalPointerPos, getMouseDistance, ImageItem } from "../utils.js";

export default class ImageTrailVariant4 {
  constructor(container) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll(".content__img")].map(
      (img) => new ImageItem(img)
    );
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 80;
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    const handlePointerMove = (ev) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("touchmove", handlePointerMove);

    const initRender = (ev) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      requestAnimationFrame(() => this.render());
      container.removeEventListener("mousemove", initRender);
      container.removeEventListener("touchmove", initRender);
    };
    container.addEventListener("mousemove", initRender);
    container.addEventListener("touchmove", initRender);
  }

  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = this.cacheMousePos.x + (this.mousePos.x - this.cacheMousePos.x) * 0.1;
    this.cacheMousePos.y = this.cacheMousePos.y + (this.mousePos.y - this.cacheMousePos.y) * 0.1;
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) { dx /= distance; dy /= distance; }
    dx *= distance / 100;
    dy *= distance / 100;

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1, scale: 0, zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4, ease: "power1", scale: 1,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        }, 0
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2, filter: `brightness(${Math.max((400 * distance) / 100, 100)}%) contrast(${Math.max((400 * distance) / 100, 100)}%)` },
        { duration: 0.4, ease: "power1", scale: 1, filter: "brightness(100%) contrast(100%)" }, 0
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power3", opacity: 0 }, 0.4)
      .to(img.DOM.el, { duration: 1.5, ease: "power4", x: `+=${dx * 110}`, y: `+=${dy * 110}` }, 0.05);
  }

  onImageActivated() { this.activeImagesCount++; this.isIdle = false; }
  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) this.isIdle = true;
  }
}
