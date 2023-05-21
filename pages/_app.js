import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import AppProvider from "../context/AppContext";

import Header from "../components/header";

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Header />
      <Component {...pageProps} />
    </AppProvider>
  );
}
