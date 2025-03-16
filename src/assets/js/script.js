class AccessibleRangeSlider {
  // Constants for class names and attributes
  static THUMB_LEFT_CLASS = "slider-touch-left";
  static THUMB_RIGHT_CLASS = "slider-touch-right";
  static TOOLTIP_CLASS = "tooltip";
  constructor(sliderElement) {
    this.slider = sliderElement;
    this.minVal = parseInt(this.slider.getAttribute("se-min"));
    this.maxVal = parseInt(this.slider.getAttribute("se-max"));
    this.step = parseInt(this.slider.getAttribute("se-step")) || 1;

    this.initDOM();
    this.initState();
    this.initialize();
}

initDOM() {
    this.leftThumb = this.slider.querySelector(".slider-touch-left");
    this.rightThumb = this.slider.querySelector(".slider-touch-right");
    this.rangeFill = this.slider.querySelector(".slider-line span");
    this.minInput = this.slider.closest(".slider-wrapper").querySelector(".current-value-min");
    this.maxInput = this.slider.closest(".slider-wrapper").querySelector(".current-value-max");
    this.result = this.slider.closest(".slider-wrapper").querySelector(".result");
    this.sliderLine = this.slider.querySelector(".slider-line");
}

initState() {
    this.currentMin = parseInt(this.minInput.value);
    this.currentMax = parseInt(this.maxInput.value);
    this.isDragging = false;
    this.activeThumb = null;
}

initialize() {
    this.createTooltips();
    this.setupAccessibility();
    this.setupEventListeners();
    this.updateThumbs();
    this.updateResult();
}

setupAccessibility() {
    this.slider.setAttribute("role", "group");
    this.slider.setAttribute("aria-label", "Range selector");

    [this.leftThumb, this.rightThumb].forEach((thumb, index) => {
        const isLeft = index === 0;
        thumb.setAttribute("role", "slider");
        thumb.setAttribute("tabindex", "0");
        thumb.setAttribute("aria-valuemin", this.minVal);
        thumb.setAttribute("aria-valuemax", this.maxVal);
        thumb.setAttribute("aria-label", isLeft ? "Minimum value" : "Maximum value");
        thumb.setAttribute("aria-valuenow", isLeft ? this.currentMin : this.currentMax);
        thumb.setAttribute("aria-orientation", "horizontal");
        thumb.setAttribute("aria-valuetext", isLeft ? `Minimum value: ${this.currentMin}` : `Maximum value: ${this.currentMax}`);
    });

    this.result.setAttribute("aria-live", "polite");
}
  /**
   * Create tooltips for the thumbs.
   */
  createTooltips() {
      const createTooltip = (value) => {
          const tooltip = document.createElement("div");
          tooltip.className = AccessibleRangeSlider.TOOLTIP_CLASS;
          tooltip.textContent = value;
          return tooltip;
      };

      this.leftThumb.appendChild(createTooltip(this.currentMin));
      this.rightThumb.appendChild(createTooltip(this.currentMax));
  }

  /**
   * Set up event listeners.
   */
  setupEventListeners() {
      [this.leftThumb, this.rightThumb].forEach((thumb) => {
          thumb.addEventListener("mousedown", this.handleDragStart.bind(this));
          thumb.addEventListener("touchstart", this.handleDragStart.bind(this), { passive: false });
          thumb.addEventListener("keydown", this.handleKeyPress.bind(this));
      });

      this.minInput.addEventListener("input", this.handleInputChange.bind(this));
      this.maxInput.addEventListener("input", this.handleInputChange.bind(this));

      window.addEventListener("mousemove", this.handleDrag.bind(this));
      window.addEventListener("touchmove", this.handleDrag.bind(this), { passive: false });
      window.addEventListener("mouseup", this.handleDragEnd.bind(this));
      window.addEventListener("touchend", this.handleDragEnd.bind(this));

      this.sliderLine.addEventListener("click", this.handleLineClick.bind(this));
      this.sliderLine.addEventListener("touchstart", this.handleLineClick.bind(this));
  }

  /**
   * Handle the start of dragging.
   * @param {Event} e - The event object.
   */
  handleDragStart(e) {
      e.preventDefault();
      this.isDragging = true;
      this.activeThumb = e.target.closest(".slider-touch");
      this.activeThumb.classList.add("active");
  }

  /**
   * Handle dragging.
   * @param {Event} e - The event object.
   */
  handleDrag(e) {
      if (!this.isDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const rect = this.slider.getBoundingClientRect();
      let x = ((clientX - rect.left) / rect.width) * 100;
      x = Math.max(0, Math.min(100, x));

      const value = this.calculateStepValue(x);

      if (this.activeThumb === this.leftThumb) {
          this.currentMin = Math.min(value, this.currentMax - this.step);
      } else {
          this.currentMax = Math.max(value, this.currentMin + this.step);
      }

      this.updateThumbs();
      this.updateInputs();
      this.updateResult();
  }

  /**
   * Handle the end of dragging.
   */
  handleDragEnd() {
      this.isDragging = false;
      this.activeThumb?.classList.remove("active");
      this.activeThumb = null;
  }

  /**
   * Handle keyboard input.
   * @param {Event} e - The event object.
   */
  handleKeyPress(e) {
      const isLeft = e.target === this.leftThumb;
      const keyActions = {
          ArrowLeft: () => (isLeft ? -this.step : -this.step),
          ArrowRight: () => (isLeft ? this.step : this.step),
          Home: () => (isLeft ? this.minVal : this.currentMin + this.step),
          End: () => (isLeft ? this.currentMax - this.step : this.maxVal),
          PageUp: () => this.step * 5,
          PageDown: () => -this.step * 5,
      };

      if (keyActions[e.key]) {
          e.preventDefault();
          const delta = keyActions[e.key]();
          this.updateValuesWithDelta(isLeft, delta);
          this.updateThumbs();
          this.updateInputs();
          this.updateResult();
      }
  }

  /**
   * Handle input changes.
   * @param {Event} e - The event object.
   */
  handleInputChange(e) {
      const value = parseInt(e.target.value) || 0;
      if (e.target === this.minInput) {
          this.currentMin = Math.max(this.minVal, Math.min(value, this.currentMax - this.step));
      } else {
          this.currentMax = Math.min(this.maxVal, Math.max(value, this.currentMin + this.step));
      }
      this.updateThumbs();
      this.updateResult();
  }

  /**
   * Handle clicks on the slider line.
   * @param {Event} e - The event object.
   */
  handleLineClick(e) {
      const rect = this.slider.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const x = ((clientX - rect.left) / rect.width) * 100;
      const value = this.calculateStepValue(x);

      const minDistance = Math.abs(value - this.currentMin);
      const maxDistance = Math.abs(value - this.currentMax);

      if (minDistance <= maxDistance) {
          this.currentMin = Math.min(Math.max(value, this.minVal), this.currentMax - this.step);
      } else {
          this.currentMax = Math.max(Math.min(value, this.maxVal), this.currentMin + this.step);
      }

      this.updateThumbs();
      this.updateInputs();
      this.updateResult();
  }

  /**
   * Calculate the stepped value based on the slider's position.
   * @param {number} x - The position percentage (0-100).
   * @returns {number} - The stepped value.
   */
  calculateStepValue(x) {
      const rawValue = this.minVal + ((this.maxVal - this.minVal) * x) / 100;
      return Math.round(rawValue / this.step) * this.step;
  }

  /**
   * Update values with a delta.
   * @param {boolean} isLeft - Whether the left thumb is being updated.
   * @param {number} delta - The change in value.
   */
  updateValuesWithDelta(isLeft, delta) {
      if (isLeft) {
          this.currentMin = Math.max(this.minVal, Math.min(this.currentMin + delta, this.currentMax - this.step));
      } else {
          this.currentMax = Math.min(this.maxVal, Math.max(this.currentMax + delta, this.currentMin + this.step));
      }
  }

  /**
   * Update the positions of the thumbs and the range fill.
   */
  updateThumbs() {
      const leftPos = ((this.currentMin - this.minVal) / (this.maxVal - this.minVal)) * 100;
      const rightPos = ((this.currentMax - this.minVal) / (this.maxVal - this.minVal)) * 100;

      this.leftThumb.style.left = `${leftPos}%`;
      this.rightThumb.style.left = `${rightPos}%`;
      this.rangeFill.style.left = `${leftPos}%`;
      this.rangeFill.style.width = `${rightPos - leftPos}%`;

      this.leftThumb.querySelector(`.${AccessibleRangeSlider.TOOLTIP_CLASS}`).textContent = this.currentMin;
      this.rightThumb.querySelector(`.${AccessibleRangeSlider.TOOLTIP_CLASS}`).textContent = this.currentMax;

      this.leftThumb.setAttribute("aria-valuenow", this.currentMin);
      this.rightThumb.setAttribute("aria-valuenow", this.currentMax);
  }

  /**
   * Update the input fields.
   */
  updateInputs() {
      this.minInput.value = this.currentMin;
      this.maxInput.value = this.currentMax;
  }

  /**
   * Update the result display.
   */
  updateResult() {
      this.result.textContent = `Min: ${this.currentMin} Max: ${this.currentMax}`;
  }
}

// Initialize all sliders
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".range-slider");
  sliders.forEach((slider) => new AccessibleRangeSlider(slider));
});