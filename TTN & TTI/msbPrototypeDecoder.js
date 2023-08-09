// * START USER SETTINGS
// the variables inside this block are intended to be changed by users

const CONVERT_PT100 = true; // enable / disable raw PT100 value conversion
const PT100_UNIT = "Celsius"; // choose the temperature unit
// ... available units are: 'celsius', 'fahrenheit', 'kelvin'

const CONVERT_BATTERY = true; // enable / disable battery unit conversion to %

// * END USER SETTINGS

// init vars
let data = {};
let warnings = [];
let errors = [];

/**
 * Convert PT100 value into a temperature value.
 *
 * @param {number} value - Raw PT100 value in ohms.
 * @param {string} [unit="C"] - Conversion unit (temperature unit).
 * @returns {number | null | undefined} - Temperature value as specific unit.
 *
 */
function convertPT100RawValue(value, unit = "C") {
  try {
    const tempC = (250 / (2127 - 557)) * (value - 557);
    const unitL = unit.slice(0, 1).toUpperCase();
    if (unitL === "C") {
      return tempC;
    } else if (unitL === "F") {
      return (9 / 5) * tempC + 32;
    } else if (unitL === "K") {
      return tempC + 273.15;
    } else {
      errors.push(
        `PT100 value could not be converted because of invalid unit: ${unit}`
      );
      return value;
    }
  } catch (e) {
    errors.push(e);
    return undefined;
  }
}

/**
 * Convert battery voltage level (in mV) to percentage [0, 100] value.
 *
 * @param {number} value - Raw battery level in millivolts (mV) [2500, 3600].
 * @param {number} min - Lower threshold to substitude with 0 %.
 * @param {number} max - Upper threshold to substitude with 100 %.
 * @returns {number} Battery level as percentage (%) in range [0, 100].
 */
function convertBatteryToPercentage(value, min = 2500, max = 3600) {
  const BAT = Math.trunc((100 * (value - min)) / (max - min));
  if (BAT > 100) {
    return 100;
  } else if (BAT < 0) {
    return 0;
  } else {
    return BAT;
  }
}

/**
 * Decoder for payloads of Multisense Bolt (MSB) prototypes.
 *
 * Includes all prototypes models: 20P, 100P, 250P.
 * Firmware versions 0.36, 0.37, 0.38 do not have `node_temp` tag.
 * Firmware versions 0.40, 0.43, 0.44 support all data tags.
 *
 * @param {object} input - Object with msg data and msg port:
 * { bytes: Uint8Array, fport: number }
 * @returns {object} JSON object with decoded data tags.
 */
function decodeUplink(input) {
  // * decode payload
  data.noise_avg = (input.bytes[0] << 8) + input.bytes[1];
  data.noise_min = (input.bytes[2] << 8) + input.bytes[3];
  data.noise_max = (input.bytes[4] << 8) + input.bytes[5];
  data.battery = CONVERT_BATTERY
    ? convertBatteryToPercentage((input.bytes[6] << 8) + input.bytes[7])
    : (input.bytes[6] << 8) + input.bytes[7];
  data.pt100 = CONVERT_PT100
    ? convertPT100RawValue((input.bytes[8] << 8) + input.bytes[9], PT100_UNIT)
    : (input.bytes[8] << 8) + input.bytes[9];
  data.mode = (input.bytes[10] & 0xfc) >> 2;
  data.gain = input.bytes[10] & 0x03;
  data.node_temp = input.bytes[11];
  // * detect warnings
  if (data.node_temp === undefined) {
    warnings.push(
      "Firmware versions 0.36, 0.37, 0.38 " +
        "do not send 'node_temp' data byte[11]."
    );
  }
  // * detect errors
  if (typeof CONVERT_PT100 == "boolean") {
    errors.push(
      `CONVERT_PT100 constant has invalid type: ${typeof CONVERT_PT100}`
    );
  }
  if (typeof PT100_UNIT == "string") {
    errors.push(`PT100_UNIT constant has invalid type: ${typeof PT100_UNIT}`);
  }
  if (data.pt100 === undefined) {
    errors.push("PT100 valaue conversion failed.");
  } else if (data.pt100 === null) {
    errors.push(`Invalid PT100 unit: ${PT100_UNIT}`);
  }
  // * return results
  return {
    data: data,
    warnings: warnings,
    errors: errors,
  };
}
