import type { AppProps } from 'next/app';
import Head from 'next/head';
// Suppress TypeScript error for side-effect CSS import when no type declarations are present
// @ts-ignore: CSS module without type declarations
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Home Chores</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#1D9E75" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Home Chores" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}