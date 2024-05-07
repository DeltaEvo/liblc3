const BYTES_PER_PAGE = 64 * 1024;

const LC3_PCM_FORMAT_FLOAT = 3;

class LC3 {
  #module;
  #encoder;
  #decoder;
  #sample_ptr;
  #frame_ptr;
  #frame_bytes;

  constructor(module, encoder, decoder, sample_ptr, frame_ptr, frame_bytes) {
    this.#module = module;
    this.#encoder = encoder;
    this.#decoder = decoder;
    this.#sample_ptr = sample_ptr;
    this.#frame_ptr = frame_ptr;
    this.#frame_bytes = frame_bytes;
  }

  get samples() {
    return new Float32Array(
      this.#module.instance.exports.memory.buffer,
      this.#sample_ptr,
      this.#module.frame_samples
    );
  }

  get frame() {
    return new Uint8Array(
      this.#module.instance.exports.memory.buffer,
      this.#frame_ptr,
      this.#frame_bytes
    );
  }

  changeBitrate(bitrate) {
    this.#frame_bytes = this.#module.frame_bytes(bitrate);
  }

  encode() {
    this.#module.instance.exports.lc3_encode(
      this.#encoder,
      LC3_PCM_FORMAT_FLOAT,
      this.#sample_ptr,
      1,
      this.#frame_bytes,
      this.#frame_ptr
    );
  }

  decode() {
    this.#module.instance.exports.lc3_decode(
      this.#decoder,
      this.#frame_ptr,
      this.#frame_bytes,
      LC3_PCM_FORMAT_FLOAT,
      this.#sample_ptr,
      1
    );
  }
}

export class LC3Module {
  #instance;
  #sample_rate_hz;
  #frame_duration_us;
  #hr_mode;
  #base_ptr;
  #encoder_size;
  #decoder_size;
  #frame_samples;
  #frame_bytes;
  #allocation_size;
  #memory_map;

  constructor({
    instance,
    frame_duration_us,
    sample_rate_hz,
    encode = false,
    decode = false,
    hr_mode = false,
    max_bitrate = 320000,
  }) {
    this.#instance = instance;
    this.#base_ptr = instance.exports.memory.buffer.byteLength;
    this.#frame_duration_us = frame_duration_us;
    this.#sample_rate_hz = sample_rate_hz;
    this.#hr_mode = hr_mode;
    this.#encoder_size = encode
      ? instance.exports.lc3_hr_encoder_size(
          hr_mode,
          frame_duration_us,
          sample_rate_hz
        )
      : 0;
    this.#decoder_size = decode
      ? instance.exports.lc3_hr_decoder_size(
          hr_mode,
          frame_duration_us,
          sample_rate_hz
        )
      : 0;

    this.#frame_samples = instance.exports.lc3_hr_frame_samples(
      hr_mode,
      frame_duration_us,
      sample_rate_hz
    );

    this.#frame_bytes = instance.exports.lc3_hr_frame_bytes(
      hr_mode,
      frame_duration_us,
      sample_rate_hz,
      max_bitrate
    );

    this.#allocation_size =
      this.#encoder_size +
      this.#decoder_size +
      this.#frame_bytes +
      this.#frame_samples * 4;

    this.#allocation_size = Math.ceil(this.#allocation_size / 4) * 4;

    this.#memory_map = [];
  }

  get instance() {
    return this.#instance;
  }

  get hr_mode() {
    return this.#hr_mode;
  }

  get frame_samples() {
    return this.#frame_samples;
  }

  frame_bytes(bitrate) {
    const frame_bytes = this.#instance.exports.lc3_hr_frame_bytes(
      this.#hr_mode,
      this.#frame_duration_us,
      this.#sample_rate_hz,
      bitrate
    );

    if (frame_bytes > this.#frame_bytes) {
      throw new Error(
        `Bitrate ${bitrate} too high, max frame size ${
          this.#frame_bytes
        } needed ${frame_bytes}`
      );
    }

    return frame_bytes;
  }

  /**
   * @return {LC3}
   */
  create() {
    const memory = this.#instance.exports.memory;
    const ptr =
      this.#base_ptr + this.#memory_map.length * this.#allocation_size;

    const pages = memory.buffer.byteLength / BYTES_PER_PAGE;

    const pages_needed = Math.ceil(
      (ptr + this.#allocation_size) / BYTES_PER_PAGE
    );

    if (pages_needed > pages) {
      console.log("Growing memory from", pages, "to", pages_needed, "pages");
      memory.grow(pages_needed - pages);
    }

    const encoder_ptr = ptr;
    const decoder_ptr = encoder_ptr + this.#encoder_size;
    const sample_ptr = decoder_ptr + this.#decoder_size;
    const frame_ptr = sample_ptr + this.#frame_samples * 4;

    const encoder =
      this.#encoder_size !== 0
        ? this.#instance.exports.lc3_hr_setup_encoder(
            this.#hr_mode,
            this.#frame_duration_us,
            this.#sample_rate_hz,
            this.#sample_rate_hz,
            encoder_ptr
          )
        : 0;

    const decoder =
      this.#decoder_size !== 0
        ? this.#instance.exports.lc3_hr_setup_decoder(
            this.#hr_mode,
            this.#frame_duration_us,
            this.#sample_rate_hz,
            this.#sample_rate_hz,
            decoder_ptr
          )
        : 0;

    const lc3 = new LC3(
      this,
      encoder,
      decoder,
      sample_ptr,
      frame_ptr,
      this.#frame_bytes
    );

    this.#memory_map.push(lc3);

    return lc3;
  }
}
