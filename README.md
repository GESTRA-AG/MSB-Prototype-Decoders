# Multisense Bolt (MSB) - Prototype Steam Trap Monitor - Payload Decoders

This repository contains Multisense Bolt (MSB) decoders for different LoRa network servers as those require different decoder formats.
The product information about the serialized device can be found on [https://contents.gestra.com](https://content.gestra.com/-/media/gestra/international/documents/en/ban/ban_850910_00_msb1-msb1ex_en.ashx?rev=07df58d633aa4f5db2c590aac8b45e52)

## Available Decoder Languages / Supported LoRa Network Servers

- [The Things Network (TTN)](https://www.thethingsnetwork.org)
- [The Things Industries (TTI)](https://console.cloud.thethings.industries)
- [LORIOT](https://loriot.io)
- Python3 (serverless)

Please feel free to suggest new implementations for unavailable LoRa network servers or to create a pull-request (PR).

## Supported Models

All prototype models are supported.

- MSB 20P
- MSB 100P
- MSB 250P

## Supported Software Versions

All software versions are supported.

- 0.36 | 0.37 | 0.38 are mostly 20P models
- 0.40 are mostly 100P models
- 0.43 | 0.44 are mostly 250P models

Software versions 0.36, 0.37, 0.38 do not have _int_temp_ tag, so this tag value may be shown as _null_ / _nan_ / _NaN_ / _undefined_ or not shown at all.
Software versions 0.40, 0.43, 0.44 support all data tags.

## Data Tags

Byte 11 is only available for software versions >= 0.40

| Position | Name      | Description                           | Raw Unit | Convertion Units |
| -------: | :-------- | :------------------------------------ | :------: | :--------------: |
| Byte 0-1 | noise_avg | Noise average of measurement period   |    mV    |        -         |
| Byte 2-3 | noise_min | Noise minimun of measurement period   |    mV    |        -         |
| Byte 4-5 | noise_max | Noise maximum of measurement period   |    mV    |        -         |
| Byte 6-7 | battery   | Battery level                         |    mV    |        %         |
| Byte 8-9 | pt100     | PT100 temprature sensor               |  &#937;  |    °C, °F, K     |
|  Byte 10 | mode      | Software version & working mode       |    -     |        -         |
|  Byte 10 | gain      | Amplifier gain                        |    -     |        -         |
|  Byte 11 | node_temp | Internal temperature of the LoRa node |    °C    |        -         |

Table 1: Data feeds of Multisense Bolt (MSB)
