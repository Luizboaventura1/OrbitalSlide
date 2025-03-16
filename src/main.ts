import "./global.css"

import Slider from "./core/Slider/Slider"

document.addEventListener("DOMContentLoaded", () => {
  const sliderElement = document.querySelector(".orbital-slider") as HTMLElement;

  if (sliderElement) {
    new Slider(sliderElement);
  }})