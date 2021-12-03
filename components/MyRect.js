import React from "react";
import { Rect } from "react-native-safe-area-context";

export default function MyRect(props) {
  return (
    <Rect
      key={props.key}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      stroke="yellow"
      strokeWidth="1"
    />
  );
}
