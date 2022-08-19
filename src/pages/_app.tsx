import 'styles/globals.scss'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

const App = ({ Component, pageProps }: AppProps) => {  
  return <Component {...pageProps} />
}

export default App;

