import {Box} from "@mui/material";
import React from "react";

export type UISpacerProps = {
  size?: 'normal' | 'big' | 'small' | 'huge'
}

const sizes = {
  huge: 10,
  big: 2,
  normal: 1,
  small: 0.5,
}

export const UISpacer = (props: UISpacerProps) => (
  <Box p={sizes[props.size ?? 'normal']}/>
)
