from __future__ import annotations
from typing import Literal
import json


def convertPT100(value: int | float) -> float:
    """Convert PT100 value for Multisense Bolt (MSB) prototypes.

    Args:
        value (int | float): Raw PT100 sensor value.

    Raises:
        TypeError: If the input data type of `value` argument is invalid.

    Returns:
        float: Converted PT100 value.
    """
    if not isinstance(value, (int, float)):
        raise TypeError(
            f"PT100 `value` must be type integer {int} or float {float}, "
            f"not type {type(value)}."
        )
    return 250 / (2127 - 557) * (value - 557)


def decode(
    payload: str | bytes | bytearray,
    dtype: Literal["dictionary", "jsonstring"] = "dictionary",
    convert: bool = False,
) -> dict[str, int | float] | str:
    """Decode Multisense Bolt (MSB) uplink payload.

    Args:
        payload (str | bytes | bytearray): Uplink payload as hexadecimal string
            or bytes like object.
        dtype (Literal['dictionary', 'jsonstring'], optional): Output data type.
            Defaults to "dictionary".
        convert (bool, optional): Enables / disables PT100 sensor value
            convertion. Defaults to False.

    Returns:
        dict[str, int | float] | str: Returns dictionary (json object)
            or json string (dumps).
    """
    if isinstance(payload, str):
        try:
            payload: bytes = bytes.fromhex(payload)
        except Exception as err:
            raise ValueError(
                f"Could not convert `payload` type {type(payload)} "
                f"to type bytes {bytes}, because exception occoured:\n{err}"
            )
    elif isinstance(payload, bytearray):
        payload: bytes = bytes(payload)  # this convertion cannot fail
    if not isinstance(payload, bytes):
        raise TypeError(
            f"Uplink `payload` must be type string {str}, bytes {bytes} or "
            f"bytearray {bytearray}."
        )
    if not isinstance(dtype, str):
        raise TypeError(
            f"Data type `dtype` must be type string {str} / "
            f"literal {Literal}, not type {type(dtype)}."
        )
    else:
        dtype: str = dtype.lower()
    if dtype not in ["dictionary", "jsonstring"]:
        raise ValueError(
            f"Data type `dtype` must be one of the following literals"
            f"({Literal}): 'dictionary' or 'jsonstring'"
        )
    data: dict[str, int | float] = {}
    data["noise_avg"]: int = int.from_bytes(
        bytes=payload[0:2], byteorder="big", signed=False
    )
    data["noise_min"]: int = int.from_bytes(
        bytes=payload[2:4], byteorder="big", signed=False
    )
    data["noise_max"]: int = int.from_bytes(
        bytes=payload[4:6], byteorder="big", signed=False
    )
    data["battery"]: int = int.from_bytes(
        bytes=payload[6:8], byteorder="big", signed=False
    )
    data["pt100"]: int | float = (
        convertPT100(
            int.from_bytes(bytes=payload[8:10], byteorder="big", signed=False)
        )
        if convert
        else int.from_bytes(bytes=payload[8:10], byteorder="big", signed=False)
    )
    data["mode"]: int = (payload[10] & 0xFC) >> 2
    data["gain"]: int = payload[10] & 0x03
    if len(payload) == 12:
        data["node_temp"]: int = payload[11]
    if dtype == "jsonstring":
        return json.dumps(obj=data, indent=None)
    else:
        return data


if __name__ == "__main__":
    # example usage
    print(
        decode(
            payload="0a6809c30ad00e4504060c27",
            dtype="jsonstring",
            convert=True,
        )
    )
