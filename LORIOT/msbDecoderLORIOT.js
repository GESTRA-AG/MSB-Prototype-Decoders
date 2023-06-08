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

const CONVERT = false;

/**
 * Convert PT100 value into a temperature value.
 *
 * @param {number} value - Raw PT100 value in ohms.
 * @returns {number} - Temperature value in degrees Celsius.
 *
 */
function convertPT100(value) {
  return (250 / (2127 - 557)) * (value - 557);
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
  data.battery = (bytes[6] << 8) + bytes[7];
  data.pt100 = CONVERT
    ? convertPT100((bytes[8] << 8) + bytes[9])
    : (bytes[8] << 8) + bytes[9];
  data.mode = (bytes[10] & 0xfc) >> 2;
  data.gain = bytes[10] & 0x03;
  data.node_temp = bytes[11];
  return data;
}

// generae JSON string to match formatter of The Things Network (TTN)
var decodedUplinkString = JSON.stringify(decodeUplink(v), null, 2);

decodedUplinkString; // this will be printed out
