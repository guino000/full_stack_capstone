import '../styles/global.css'
import {StyledEngineProvider} from "@mui/material";
import React from 'react';
import {AppProps} from "next/app";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from "../components/layout";

export default function App({Component, pageProps}: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StyledEngineProvider>
  )
}
