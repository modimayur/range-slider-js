# Accessible Range Slider

Check out the live demo: [Demo Link](https://codepen.io/modimayur/full/jEOYdyX) <!-- Replace with an actual link -->

An **accessible**, **customizable**, and **mobile-friendly** range slider built with **Vanilla JavaScript**. This slider supports dual handles, keyboard navigation, and ARIA attributes for improved accessibility.

![Range Slider Demo](https://github.com/modimayur/range-slider-js/blob/main/screenshot/range-slider-js-screenshot.png) <!-- Replace with an actual screenshot or GIF -->


# Features
- **Dual Handles:** Select a range with two draggable handles.
- **Keyboard Navigation:** Adjust values using arrow keys, `Home`, `End`, `PageUp`, and `PageDown`.
- **Accessibility:** Fully compliant with ARIA standards, including `role="slider"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- **Customizable:** Easily customize the slider's appearance and behavior using CSS and JavaScript.
- **Touch Support:** Works seamlessly on touch devices.
- **Real-Time Updates:** Displays the selected range in real-time.


## Installation

### Via NPM
You can install the slider as an NPM package:
```bash
npm install accessible-range-slider
```

### Manual Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/accessible-range-slider.git
   ```
2. Include the CSS and JavaScript files in your project:
   ```html
   <link rel="stylesheet" href="path/to/accessible-range-slider.css">
   <script src="path/to/accessible-range-slider.js"></script>
   ```

---

## Usage

### Basic HTML Structure
```html
<div class="slider-container">
    <h1>Range Slider</h1>
    <div class="slider-wrapper">
        <div class="input-wrapper">
            <input type="text" class="form-control current-value-min" value="200" />
            <input type="text" class="form-control current-value-max" value="800" />
        </div>
        <div class="range-slider" se-min="0" se-max="1000" se-step="10" aria-label="Price range">
            <div class="slider-line"><span></span></div>
            <div class="slider-touch slider-touch-left" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="200" aria-label="Minimum value"></div>
            <div class="slider-touch slider-touch-right" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="800" aria-label="Maximum value"></div>
        </div>
        <div class="result">Min: 200 Max: 800</div>
    </div>
</div>
```

### Initialize the Slider
```javascript
document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll(".range-slider");
    sliders.forEach((slider) => new AccessibleRangeSlider(slider));
});
```

---

## Customization

### CSS Variables
You can customize the slider's appearance using CSS variables:
```css
:root {
    --slider-track-color: #ddd;
    --slider-fill-color: #4a90e2;
    --slider-thumb-color: #fff;
    --slider-thumb-border-color: #4a90e2;
    --slider-thumb-size: 20px;
    --slider-track-height: 4px;
}
```

### JavaScript Options
Pass options to the `AccessibleRangeSlider` constructor:
```javascript
const slider = new AccessibleRangeSlider(sliderElement, {
    min: 0,
    max: 1000,
    step: 10,
    initialMin: 200,
    initialMax: 800,
});
```

---

## Accessibility

The slider is designed to be fully accessible:
- **ARIA Attributes:** Includes `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-label`.
- **Keyboard Navigation:** Supports arrow keys, `Home`, `End`, `PageUp`, and `PageDown`.
- **Screen Reader Support:** Provides `aria-valuetext` and `aria-live` for real-time updates.

---

## Browser Support

The slider works on all modern browsers, including:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers (iOS, Android)

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
