import React from 'react';
import ResponsiveAppBar from "./responsiveAppBar";

// @ts-ignore
export default function Layout({children}) {
  return (
    <>
      <ResponsiveAppBar/>
      <main>{children}</main>
    </>
  );
}
