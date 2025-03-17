import { describe, it, expect, vi, beforeEach } from "vitest"
import Slider from "../core/Slider"

describe("Slider", () => {
  let sliderElement: HTMLElement
  let slider: Slider

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="orbital-slider">
        <div class="orbital-slider-container">
          <div class="orbital-slide">Slide 1</div>
          <div class="orbital-slide">Slide 2</div>
          <div class="orbital-slide">Slide 3</div>
        </div>
        <button class="orbital-button-prev orbital-button"></button>
        <button class="orbital-button-next orbital-button"></button>
      </div>
    `

    sliderElement = document.querySelector(".orbital-slider") as HTMLElement
    slider = new Slider(sliderElement)
  })

  it("should initialize correctly", () => {
    expect(slider["sliderContainer"]).toBeDefined()
    expect(slider["slides"].length).toBe(3)
    expect(slider["currentPosition"]).toBe(0)
    expect(slider["currentSlideIndex"]).toBe(0)
    expect(slider["slideWidth"]).toBe(slider["slides"][0].offsetWidth)
    expect(slider["isDragging"]).toBe(false)
  })

  it("should advance to the next slide when clicking the 'next' button", () => {
    const nextButton = document.querySelector(
      ".orbital-button-next",
    ) as HTMLElement
    if (nextButton) {
      nextButton.click()
      expect(slider["currentSlideIndex"]).toBe(1)
      expect(slider["currentPosition"]).toBeCloseTo(-slider["slideWidth"])
    }
  })

  it("should go back to the previous slide when clicking the 'previous' button", () => {
    const previousButton = document.querySelector(
      ".orbital-button-prev",
    ) as HTMLElement
    if (previousButton) {
      const nextButton = document.querySelector(
        ".orbital-button-next",
      ) as HTMLElement
      if (nextButton) {
        nextButton.click()
      }

      previousButton.click()
      expect(slider["currentSlideIndex"]).toBe(0)
      expect(slider["currentPosition"]).toBe(0)
    }
  })

  it("should start dragging when clicking on the slider container", () => {
    const sliderContainer = document.querySelector(
      ".orbital-slider-container",
    ) as HTMLElement
    const mockEvent = { clientX: 100 } as MouseEvent
    sliderContainer.dispatchEvent(new MouseEvent("mousedown", mockEvent))

    expect(slider["isDragging"]).toBe(true)
    expect(slider["dragStartPosition"]).toBe(100)
    expect(slider["sliderContainer"].style.transition).toBe("none")
  })

  it("should move the slider during dragging", () => {
    const sliderContainer = document.querySelector(
      ".orbital-slider-container",
    ) as HTMLElement
    const mockStartEvent = { clientX: 100 } as MouseEvent
    sliderContainer.dispatchEvent(new MouseEvent("mousedown", mockStartEvent))

    const mockMoveEvent = { clientX: 200 } as MouseEvent
    document.dispatchEvent(new MouseEvent("mousemove", mockMoveEvent))

    expect(slider["currentPosition"]).toBe(100)
    expect(slider["sliderContainer"].style.left).toBe("100px")
  })

  it("should finish dragging and adjust the slide position", () => {
    const sliderContainer = document.querySelector(
      ".orbital-slider-container",
    ) as HTMLElement
    const mockStartEvent = { clientX: 100 } as MouseEvent
    sliderContainer.dispatchEvent(new MouseEvent("mousedown", mockStartEvent))

    const mockMoveEvent = { clientX: 200 } as MouseEvent
    document.dispatchEvent(new MouseEvent("mousemove", mockMoveEvent))

    document.dispatchEvent(new MouseEvent("mouseup"))

    expect(slider["isDragging"]).toBe(false)
    expect(slider["sliderContainer"].style.transition).toBe(
      "left 0.3s ease-in-out",
    )
    expect(slider["currentSlideIndex"]).toBe(0)
    expect(slider["currentPosition"]).toBeCloseTo(0)
    expect(slider["sliderContainer"].style.left).toBe("0px")
  })

  it("should update the slide position when resizing the window", () => {
    const originalWidth = slider["slideWidth"]
    vi.spyOn(slider as never, "calculateSlideWidth").mockReturnValue(
      originalWidth + 50,
    )

    window.dispatchEvent(new Event("resize"))

    expect(slider["slideWidth"]).toBe(originalWidth + 50)
    expect(slider["currentPosition"]).toBeCloseTo(0)
    expect(slider["sliderContainer"].style.left).toBe("0px")
  })

  it("should throw an error if the container is not found", () => {
    document.body.innerHTML = '<div class="orbital-slider"></div>'
    const sliderElement = document.querySelector(
      ".orbital-slider",
    ) as HTMLElement

    expect(() => new Slider(sliderElement)).toThrowError(
      'Element with selector ".orbital-slider-container" not found.',
    )
  })
})
