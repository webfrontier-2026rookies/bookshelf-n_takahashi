import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { Provider as UrqlProvider } from 'urql';
import '@mantine/core/styles.css';
import { urqlClient } from '@/lib/urql';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider defaultColorScheme="light">
      <UrqlProvider value={urqlClient}>
        <Component {...pageProps} />
      </UrqlProvider>
    </MantineProvider>
  );
}
