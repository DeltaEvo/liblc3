import { LC3Module } from "./liblc3.js";

class LC3Processor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this.frame_duration_us = 7500;
    this.hr_mode = false;
    this.port.onmessage = (event) => this.onMessage(event.data);
    this.channels = [];
  }
  onMessage({ type, data }) {
    switch (type) {
      case "module":
        WebAssembly.instantiate(data).then(({ instance }) => {
          this.liblc3 = new LC3Module({
            instance,
            frame_duration_us: this.frame_duration_us,
            hr_mode: this.hr_mode,
            sample_rate_hz: sampleRate,
            encode: true,
            decode: true,
          });
        });
        break;
      case "bitrate":
        for (const channel of this.channels) {
          channel.lc3.changeBitrate(data);
        }
        break;
    }
  }

  process(inputs, outputs) {
    if (this.liblc3) {
      for (const [i, input] of inputs[0].entries()) {
        if (this.channels.length == i) {
          this.channels.push({
            index: 0,
            lc3: this.liblc3.create(),
          });
        }

        const { lc3, index } = this.channels[i];
        const output = outputs[0][i];

        const remaining = lc3.samples.length - index;

        if (remaining > output.length) {
          const view = lc3.samples.subarray(index, index + output.length);
          output.set(view);
          view.set(input);
          this.channels[i].index += view.length;
        } else {
          const ouput_head = output.subarray(0, remaining);
          const output_tail = output.subarray(remaining);
          const input_head = input.subarray(0, remaining);
          const input_tail = input.subarray(remaining);

          const head = lc3.samples.subarray(index);
          const tail = lc3.samples.subarray(0, output_tail.length);

          ouput_head.set(head);
          head.set(input_head);

          lc3.encode();
          lc3.decode();

          output_tail.set(tail);
          tail.set(input_tail);

          this.channels[i].index = tail.length;
        }
      }
    }
    return true;
  }
}

registerProcessor("lc3-processor", LC3Processor);
