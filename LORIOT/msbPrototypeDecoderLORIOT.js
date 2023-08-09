/**
  This code is for formatting / decoding / converting of the "Payload" column
  of the data streams of the "Websocket Applications" of loriot.io webapp,
  especially https://SUBDOMAIN.loriot.io/application/APP_NAME/websocket

  In this editor, you can define your custom javascript code
  to parse the incoming data.

  The following variables are available:
  =============================================================================
  data     : hex string of the data
  p        : array of bytes represented as string of 2 hex digits
  v        : array of bytes represented as integers
  msg.EUI  : device EUI
  msg.fcnt : message frame counter
  msg.port : message port field
  msg.ts   : message timestamp as number (epoch)
  =============================================================================

  Last line of your script will be printed to the data payload column!
**/

// * START USER SETTINGS
// the variables inside this block are intended to be changed by users

const CONVERT_PT100 = false; // enable / disable raw PT100 value conversion
const PT100_UNIT = "Celsius"; // choose the temperature unit
// ... available units are: 'celsius', 'fahrenheit', 'kelvin'

const CONVERT_BATTERY = true; // enable / disable battery unit conversion to %

// * END USER SETTINGS

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
      return value;
    }
  } catch (e) {
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
 * Includes all prototypes models: 20P, 100P, 250P.
 * Firmware versions 0.36, 0.37, 0.38 do not have `int_temp` tag, so this
 * tag value will probably be shown as `null` / `nan` / `NaN` / `undefined`
 * or not shown at all.
 * Firmware versions 0.40, 0.43, 0.44 support all data tags.
 *
 * @param {Array} bytes - Uint8Array containing data byte values.
 * @returns {object} JSON object with decoded data tags.
 */
function decodeUplink(bytes) {
  var data = {};
  data.noise_avg = (bytes[0] << 8) + bytes[1];
  data.noise_min = (bytes[2] << 8) + bytes[3];
  data.noise_max = (bytes[4] << 8) + bytes[5];
  data.battery = CONVERT_BATTERY
    ? convertBatteryToPercentage((input.bytes[6] << 8) + input.bytes[7])
    : (input.bytes[6] << 8) + input.bytes[7];
  data.pt100 = CONVERT_PT100
    ? convertPT100RawValue((input.bytes[8] << 8) + input.bytes[9], PT100_UNIT)
    : (input.bytes[8] << 8) + input.bytes[9];
  data.mode = (bytes[10] & 0xfc) >> 2;
  data.gain = bytes[10] & 0x03;
  data.node_temp = bytes[11];
  return data;
}

// generae JSON string to match formatter of The Things Network (TTN)
var decodedUplinkString = JSON.stringify(decodeUplink(v), null, 2);

decodedUplinkString; // this will be printed out
