const template = document.createElement("template");

const html = String.raw;

template.innerHTML = html`
  <style>
    :host {
      display: inline-flex;
    }
  </style>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 600 200"
    fill="#ffffff"
    id="svg"
  >
    <line
      id="needle"
      x1="300"
      y1="280"
      x2="125"
      y2="90"
      stroke="var(--primary)"
      stroke-width="4"
      transform-origin="300 280"
      transform="rotate(0)"
    />

    <text
      id="text"
      x="20"
      y="180"
      style="font-size: 25px"
      fill="var(--primary)"
    ></text>

    <!-- center curve -->
    <path
      d="M125,90 A220,55 0 0,1 460,90"
      stroke="#ffffff"
      fill="none"
      stroke-width="2"
    />
    <!-- end red curve -->
    <path
      d="M368,75 A220,55 0 0,1 460,91 l12,-14 A220,55 0 0,0 373,60 L368,73"
      fill="var(--red)"
    />

    // 1.08571428571 // -45.7142857143

    <line
      x1="107"
      y1="70.45"
      x2="132"
      y2="97.59"
      stroke="#ffffff"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(5)"
    />

    <line
      x1="123"
      y1="87.83"
      x2="146"
      y2="112.80"
      stroke="#ffffff"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(16)"
    />

    <line
      x1="131"
      y1="96.51"
      x2="153"
      y2="120.40"
      stroke="#ffffff"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(26)"
    />

    <line
      x1="133"
      y1="98.68"
      x2="155"
      y2="122.57"
      stroke="#ffffff"
      stroke-width="1"
      transform-origin="300 280"
      transform="rotate(30.5)"
    />

    <line
      x1="135"
      y1="100.85"
      x2="157"
      y2="124.74"
      stroke="#ffffff"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(35.5)"
    />

    <line
      x1="136"
      y1="101.94"
      x2="158"
      y2="125.83"
      stroke="#ffffff"
      stroke-width="1"
      transform-origin="300 280"
      transform="rotate(40.5)"
    />

    <line
      x1="136"
      y1="101.94"
      x2="158"
      y2="125.83"
      stroke="#ffffff"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(46)"
    />

    <line
      x1="135"
      y1="100.85"
      x2="157"
      y2="124.74"
      stroke="#ffffff"
      stroke-width="1"
      transform-origin="300 280"
      transform="rotate(51)"
    />

    <line
      x1="133"
      y1="98.68"
      x2="155"
      y2="122.57"
      stroke="#ffffff"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(56)"
    />

    <line
      x1="131"
      y1="96.51"
      x2="153"
      y2="120.40"
      stroke="var(--red)"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(61.5)"
    />

    <line
      x1="127"
      y1="92.17"
      x2="149"
      y2="116.06"
      stroke="var(--red)"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(66)"
    />

    <line
      x1="123"
      y1="87.83"
      x2="146"
      y2="112.80"
      stroke="var(--red)"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(70)"
    />

    <line
      x1="118"
      y1="82.40"
      x2="141"
      y2="107.37"
      stroke="var(--red)"
      stroke-width="2"
      transform-origin="300 280"
      transform="rotate(75)"
    />

    <text x="72" y="38" style="font-size: 30px">-</text>

    <text x="102" y="45" style="font-size: 23px">20</text>
    <text x="161" y="38" style="font-size: 23px">10</text>
    <text x="220" y="33" style="font-size: 23px">7</text>
    <text x="262" y="30" style="font-size: 23px">5</text>
    <text x="310" y="30" style="font-size: 23px">3</text>

    <text x="380" y="34" fill="var(--red)" style="font-size: 23px">0</text>
    <text x="445" y="45" fill="var(--red)" style="font-size: 23px">3</text>

    <text x="504" y="38" fill="var(--red)" style="font-size: 30px">+</text>

    <text x="270" y="145" style="font-size: 40px">VU</text>
  </svg>
`;

class VuMeter extends HTMLElement {
  static observedAttributes = ["width", "height", "text"];

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.svg = shadowRoot.getElementById("svg");
    this.text = shadowRoot.getElementById("text");
    this.needle = shadowRoot.getElementById("needle");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "width" || name === "height") {
      this.svg.setAttribute(name, newValue);
    } else if (name === "text") {
      console.log(name, newValue);
      this.text.textContent = newValue;
    }
  }

  get width() {
    return this.svg.width;
  }
  get height() {
    return this.svg.height;
  }

  set width(value) {
    this.svg.width = value;
  }
  set height(value) {
    this.svg.height = value;
  }

  set level(value) {
    this.needle.setAttribute("transform", `rotate(${value * 83})`);
  }
}

customElements.define("vu-meter", VuMeter);
