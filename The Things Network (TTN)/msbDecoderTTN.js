const CONVERT = false; // ! be patient with setting this to true on TTN
// this will convert the measured PT100 value and forward non-raw data

function convertPT100(value) {
  return (250 / (2127 - 557)) * (value - 557);
}

function decodeUplink(input) {
  // * Decoder for payloads of Multisense Bolt (MSB) prototypes.
  // * Includes all prototypes models: 20P, 100P, 250P.
  // * Firmware versions 0.36, 0.37, 0.38 do not have `int_temp` tag, so this
  // * tag value will probably be shown as `null` / `nan` / `NaN` / `undefined`
  // * or not shown at all.
  // * Firmware versions 0.40, 0.43, 0.44 support all data tags.
  var data = {};
  data.noise_avg = (input.bytes[0] << 8) + input.bytes[1];
  data.noise_min = (input.bytes[2] << 8) + input.bytes[3];
  data.noise_max = (input.bytes[4] << 8) + input.bytes[5];
  data.battery = (input.bytes[6] << 8) + input.bytes[7];
  data.pt100 = CONVERT
    ? convertPT100((input.bytes[8] << 8) + input.bytes[9])
    : (input.bytes[8] << 8) + input.bytes[9];
  data.mode = (input.bytes[10] & 0xfc) >> 2;
  data.gain = input.bytes[10] & 0x03;
  data.node_temp = input.bytes[11];
  return {
    data: data,
    warnings: [],
    errors: [],
  };
}
