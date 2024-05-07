const VU_ATTACK_TIME_SEC = 0.1;
const VU_RELEASE_TIME_SEC = 0.8;

const FRAME_SEC = 128 / sampleRate;

const VU_ATTACK_Z0 = Math.exp((-3 * FRAME_SEC) / VU_ATTACK_TIME_SEC);
const VU_RELEASE_Z0 = Math.exp((-3 * FRAME_SEC) / VU_RELEASE_TIME_SEC);

class VuProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.levels = [];
  }
  process(inputs, outputs) {
    this.levels = Array.from({
      length: Math.max(inputs[0].length, this.levels.length),
    })
      .map((_, i) => [inputs[0][i], this.levels[i]])
      .map(([input = [0], level = 0]) => {
        const max = Math.max(...input.map((sample) => Math.abs(sample)));

        const z0 = max > level ? VU_ATTACK_Z0 : VU_RELEASE_Z0;

        return max + z0 * (level - max);
      });

    this.port.postMessage(this.levels);

    return true;
  }
}

registerProcessor("vu-processor", VuProcessor);
