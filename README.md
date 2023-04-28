# Multisense Bolt (MSB) Prototype Decoders

This repository contains Multisense Bolt (MSB) decoders for different LoRa network servers as those require different decoder formats.

## Available Decoder Languages / Supported LoRa Network Servers

- The Things Network (TTN)
- LORIOT
- Python3

Please feel free to suggest new implementations for unavailable LoRa network servers or to create a pull-request.

## Supported Models

All prototype models are supported.

- MSB 20P
- MSB 100P
- MSB 250P

## Supported Firmware Versions

All firmware versions are supported.

- 0.36 | 0.37 | 0.38 which are mostly 20P models
- 0.40 which are mostly 100P models
- 0.43 | 0.44 which are mostly 250P models

Firmware versions 0.36, 0.37, 0.38 do not have _int_temp_ tag, so this tag value will probably be shown as _null_ / _nan_ / _NaN_ / _undefined_ or not shown at all.
Firmware versions 0.40, 0.43, 0.44 support all data tags.
