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

function calcPT100(value) {
  return ((250 - 0) / (2127 - 557)) * (value - 557);
}

function decodeUplink(bytes) {
  // * Decoder for payloads of Multisense Bolt (MSB) prototypes.
  // * Includes all prototypes models: 20P, 100P, 250P.
  // * Firmware versions 0.36, 0.37, 0.38 do not have `int_temp` tag, so this
  // * tag value will probably be shown as `null` / `nan` / `NaN` / `undefined`
  // * or not shown at all.
  // * Firmware versions 0.40, 0.43, 0.44 support all data tags.
  var data = {};
  data.noise_avg = (bytes[0] << 8) + bytes[1];
  data.noise_min = (bytes[2] << 8) + bytes[3];
  data.noise_max = (bytes[4] << 8) + bytes[5];
  data.battery = (bytes[6] << 8) + bytes[7];
  data.PT100 = (bytes[8] << 8) + bytes[9];
  data.mode = (bytes[10] & 0xfc) >> 2;
  data.gain = bytes[10] & 0x03;
  data.int_temp = bytes[11];
  return data;
}

// generae JSON string to match formatter of The Things Network (TTN)
var decodedUplinkString = JSON.stringify(decodeUplink(v), null, 2);

decodedUplinkString; // this will be printed out
