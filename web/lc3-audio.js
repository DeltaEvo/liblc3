import "./vu-meter.js";

const template = document.createElement("template");

const html = String.raw;

template.innerHTML = html`
  <style>
    :host {
      margin: 20px 0;
      display: inline-grid;
      grid-template-columns: 1fr 2fr;

      border: 2px solid var(--primary);
      border-radius: 0.5rem;
    }

    audio {
      margin: 20px 0;
      display: inline-grid;
      grid-template-columns: 1fr 2fr;

      border: 2px solid var(--primary);
      border-radius: 0.5rem;
    }

    .controls input[type="range"] {
      --rules: 32;
      --rule-size: 1px;
      --bar-size: 8px;

      position: relative;
      appearance: none !important;
      background: inherit;
      margin: 0.5rem 0;
      height: 2rem;
      width: 15rem;
      transform: rotate(-90deg);
      margin: 7rem -6rem;

      background-image: linear-gradient(
          0deg,
          transparent calc(50% - var(--bar-size) / 2 - 1px),
          #09090b calc(50% - var(--bar-size) / 2),
          #09090b calc(50% + var(--bar-size) / 2),
          transparent calc(50% + var(--bar-size) / 2 + 1px)
        ),
        linear-gradient(90deg, #a1a1aa 0 var(--rule-size), transparent 0);
      background-repeat: repeat-x;
      background-size: auto auto,
        calc((100% - var(--rule-size)) / var(--rules)) auto;
    }

    .controls input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      background-color: #272b2c;
      border: none;
      border-radius: 0;
      background: linear-gradient(
        90deg,
        var(--primary) 0,
        var(--secondary) calc(30%),
        var(--secondary) calc(50% - 2px),
        var(--primary) calc(50%),
        var(--secondary) calc(50% + 2px),
        var(--secondary) calc(70%),
        var(--primary) calc(100%)
      );
      cursor: row-resize;
      height: 1.5rem;
      width: 2.5rem;
      z-index: 10;
    }

    .controls input[type="range"]::-moz-range-thumb {
      background-color: #272b2c;
      border: none;
      border-radius: 0;
      background: linear-gradient(
        90deg,
        var(--primary) 0,
        var(--secondary) calc(30%),
        var(--secondary) calc(50% - 2px),
        var(--primary) calc(50%),
        var(--secondary) calc(50% + 2px),
        var(--secondary) calc(70%),
        var(--primary) calc(100%)
      );
      cursor: row-resize;
      height: 1.5rem;
      width: 2.5rem;
      z-index: 10;
    }

    .bitrate-container {
      display: flex;
      padding: 0.5rem;
      align-items: center;
    }

    .controls {
      display: flex;
      justify-content: space-around;
      padding: 0.5rem;
    }

    .control-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .control-container > svg {
      width: 24px;
      height: 24px;
    }

    .control-container > label {
      line-height: 24px;
    }

    #volume-icon:not(.muted) g:nth-child(2) {
      display: none;
    }

    #volume-icon.muted g:nth-child(1) {
      display: none;
    }

    .meters {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      border-left: 1px solid var(--primary);
    }

    .meters > vu-meter {
      border-top: 1px solid var(--primary);
    }

    .play > input {
      display: none;
    }

    .play > input:checked ~ svg > path:nth-child(1) {
      display: none;
    }

    .play > input:not(:checked) ~ svg > path:nth-child(2) {
      display: none;
    }

    .play-container {
      grid-column: 1 / span 2;
      display: flex;
      align-items: center;
      margin-right: auto;
    }

    .seven-segment {
      font-family: "7segment", sans-serif;
      white-space: pre;
      position: relative;
      z-index: 0;
    }

    .seven-segment:before {
      position: absolute;
      z-index: -1;
      color: var(--secondary);
      content: attr(background);
    }

    .display {
      display: flex;
      background: #030712;
      width: 95%;
      margin-top: 0.5rem;
      margin-bottom: auto;
      color: var(--primary);
      font-size: 30px;
      line-height: 30px;
      padding: 0.5rem;
      box-sizing: border-box;

      --primary: #22c55e;
      --secondary: #166534;
    }

    .display .static {
      font-size: 15px;
    }

    .display .spacer {
      margin: auto;
    }
  </style>
  <audio id="audio"></audio>
  <div class="controls">
    <div class="control-container">
      <svg
        id="volume-icon"
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <g>
          <path
            d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"
          />
          <path
            d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"
          />
        </g>

        <g>
          <path
            d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z"
          />
        </g>
      </svg>
      <input
        id="volume"
        class="volume"
        type="range"
        name="volume"
        min="0"
        max="1"
        value="1"
        step="0.01"
        autocomplete="off"
      />
    </div>
    <div class="control-container">
      <label for="bitrate">Bitrate</label>
      <input
        type="range"
        id="bitrate"
        name="bitrate"
        min="16000"
        max="320000"
        value="320000"
        autocomplete="off"
      />
    </div>
  </div>
  <div class="meters">
    <div class="display">
      <span id="bitrate-display" class="seven-segment" background="888888"
        >320000</span
      >
      &nbsp;
      <span class="static">bit/s</span>
      <span class="spacer">&nbsp;</span>
      <span id="time-value" class="seven-segment" background="8:88">0:00</span>
      <span class="static">/</span>
      <span id="max-time-value" class="seven-segment" background="8:88"
        >0:00</span
      >
    </div>
    <div class="play-container">
      <label class="play">
        <input type="checkbox" autocomplete="off" id="play" />
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
            clip-rule="evenodd"
          />

          <path
            fill-rule="evenodd"
            d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
      <input id="time" type="range" min="0" max="0" />
    </div>
    <vu-meter id="channel0" width="300" height="100" text="CH0"></vu-meter>
    <vu-meter id="channel1" width="300" height="100" text="CH1"></vu-meter>
  </div>
`;

class LC3Audio extends HTMLElement {
  static observedAttributes = ["src"];

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    const audio = shadowRoot.getElementById("audio");
    const play = shadowRoot.getElementById("play");
    const bitrate = shadowRoot.getElementById("bitrate");
    const bitrateDisplay = shadowRoot.getElementById("bitrate-display");
    const volume = shadowRoot.getElementById("volume");
    const volumeIcon = shadowRoot.getElementById("volume-icon");
    const time = shadowRoot.getElementById("time");
    const timeValue = shadowRoot.getElementById("time-value");
    const maxTimeValue = shadowRoot.getElementById("max-time-value");
    const channel0 = shadowRoot.getElementById("channel0");
    const channel1 = shadowRoot.getElementById("channel1");

    this.audio = audio;

    function formatTime(time) {
      const minutes = Math.trunc(time / 60);
      const seconds = Math.trunc(time % 60);

      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    function setDuration() {
      const duration = isNaN(audio.duration) ? 0 : audio.duration;
      time.setAttribute("max", duration);
      maxTimeValue.textContent = formatTime(duration);
    }

    audio.addEventListener("durationchange", setDuration);
    setDuration();

    audio.addEventListener("timeupdate", () => {
      const currentTime = isNaN(audio.currentTime) ? 0 : audio.currentTime;
      time.value = currentTime;
      timeValue.textContent = formatTime(currentTime);
    });

    audio.addEventListener("ended", () => {
      play.checked = false;
    });

    audio.addEventListener("abort", () => {
      play.checked = false;
    });

    time.addEventListener("input", () => {
      audio.currentTime = time.value;
    });

    function setBitrateValue() {
      const effectiveBitrate = Math.ceil(
        Math.floor(bitrate.value / 3200) * 3200
      );
      bitrateDisplay.textContent = effectiveBitrate.toString().padStart(6, " ");
    }

    bitrate.addEventListener("input", setBitrateValue);
    setBitrateValue();

    volume.addEventListener("input", () => {
      if (volume.value == 0) {
        volumeIcon.classList.add("muted");
      } else {
        volumeIcon.classList.remove("muted");
      }

      // Scale volume non linearly
      const DYNAMIC_RANGE_DB = 30;
      audio.volume = Math.pow(
        10,
        (volume.value * DYNAMIC_RANGE_DB - DYNAMIC_RANGE_DB) / 20
      );
    });

    play.addEventListener("input", () => {
      if (play.checked) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener(
      "play",
      async () => {
        const audioContext = new AudioContext({ sampleRate: 48000 });

        // Sending an already compiled module doesn't seems to work on chrome
        // TODO: replace with const module = await WebAssembly.compileStreaming(fetch("liblc3.wasm"));
        const module = await fetch(
          "https://deltaevo.github.io/liblc3/liblc3.wasm"
        ).then((res) => res.arrayBuffer());

        const track = audioContext.createMediaElementSource(audio);
        await audioContext.audioWorklet.addModule("lc3-worklet-processor.js");
        const lc3 = new AudioWorkletNode(audioContext, "lc3-processor");

        lc3.port.postMessage({ type: "module", data: module });
        lc3.onprocessorerror = (event) => {
          console.log("LC3 processor error", event);
        };
        bitrate.addEventListener("input", (event) => {
          lc3.port.postMessage({ type: "bitrate", data: event.target.value });
        });

        track.connect(lc3);
        lc3.connect(audioContext.destination);

        await audioContext.audioWorklet.addModule("vu-processor.js");
        const vu = new AudioWorkletNode(audioContext, "vu-processor");
        lc3.connect(vu);

        vu.port.onmessage = (event) => {
          const [level0 = 0, level1 = 0] = event.data;

          channel0.level = level0;
          channel1.level = level1;
        };

        vu.onprocessorerror = (event) => {
          console.log("VU processor error", event);
        };
      },
      { once: true }
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      this.audio.setAttribute("src", newValue);
    }
  }

  get src() {
    return this.getAttribute("src");
  }

  set src(value) {
    return this.setAttribute("src", value);
  }
}

customElements.define("lc3-audio", LC3Audio);
