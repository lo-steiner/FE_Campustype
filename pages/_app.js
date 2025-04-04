import Layout from "../components/Layout/Layout";
import "react-toastify/dist/ReactToastify.css";
import GlobalContextProvider from "../store/index.js";

export default function App({ Component, pageProps }) {
    return (
        <GlobalContextProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </GlobalContextProvider>
    );
}
