class Slider {
  private sliderContainer: HTMLElement;
  private slides: HTMLElement[];
  private nextButton: HTMLElement | null;
  private previousButton: HTMLElement | null;

  private currentPosition: number = 0;
  private currentSlideIndex: number = 0;
  private slideWidth: number;

  private isDragging: boolean = false;
  private dragStartPosition: number = 0;

  constructor(sliderElement: HTMLElement) {
    this.sliderContainer = this.getRequiredElement(sliderElement, ".orbital-slider-container");
    this.slides = this.getSlideElements(this.sliderContainer);
    this.nextButton = sliderElement.querySelector(".orbital-button-next");
    this.previousButton = sliderElement.querySelector(".orbital-button-prev");

    this.slideWidth = this.calculateSlideWidth();
    this.setupEventListeners();
  }

  private getRequiredElement(parent: HTMLElement, selector: string): HTMLElement {
    const element = parent.querySelector(selector) as HTMLElement | null;
    if (!element) {
      throw new Error(`Element with selector "${selector}" not found.`);
    }
    return element;
  }

  private getSlideElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(".orbital-slide")) as HTMLElement[];
  }

  private calculateSlideWidth(): number {
    if (this.slides.length === 0) {
      return 0;
    }
    return this.slides[0].offsetWidth;
  }

  private setupEventListeners(): void {
    this.sliderContainer.addEventListener("mousedown", this.handleDragStart.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));

    if (this.nextButton) {
      this.nextButton.addEventListener("click", this.handleNextSlide.bind(this));
    }
    if (this.previousButton) {
      this.previousButton.addEventListener("click", this.handlePreviousSlide.bind(this));
    }
  }

  private handleDragStart(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStartPosition = event.clientX - this.currentPosition;
    this.sliderContainer.style.transition = "none";

    const handleDragMove = this.handleDragMove.bind(this);
    const handleDragEnd = this.handleDragEnd.bind(this);

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd, { once: true });
  }

  private handleDragMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.currentPosition = event.clientX - this.dragStartPosition;
    this.sliderContainer.style.left = `${this.currentPosition}px`;
  }

  private handleDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.sliderContainer.style.transition = "left 0.3s ease-in-out";
    this.updateSlidePosition();
  }

  private updateSlidePosition(): void {
    this.currentSlideIndex = Math.round(-this.currentPosition / this.slideWidth);
    this.currentSlideIndex = Math.max(0, Math.min(this.currentSlideIndex, this.slides.length - 1));
    this.currentPosition = -this.currentSlideIndex * this.slideWidth;
    this.sliderContainer.style.left = `${this.currentPosition}px`;
  }

  private handleResize(): void {
    this.slideWidth = this.calculateSlideWidth();
    this.currentPosition = -this.currentSlideIndex * this.slideWidth;
    this.sliderContainer.style.left = `${this.currentPosition}px`;
  }

  private handleNextSlide(): void {
    if (this.currentSlideIndex === this.slides.length - 1) return;
    this.currentSlideIndex++;
    this.currentPosition -= this.slideWidth;
    this.sliderContainer.style.left = `${this.currentPosition}px`;
  }

  private handlePreviousSlide(): void {
    if (this.currentSlideIndex === 0) return;
    this.currentSlideIndex--;
    this.currentPosition += this.slideWidth;
    this.sliderContainer.style.left = `${this.currentPosition}px`;
  }
}

export default Slider;