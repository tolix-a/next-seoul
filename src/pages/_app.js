import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuTapBar from "@/components/MenuTapBar";
import "@/styles/globals.scss";
import "@/styles/reset.scss";
import { Suspense, useEffect, useState } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import useMainStore from "@/store/main_store";
import Loading from "@/components/Loading";
import TopButton from "@/components/TopButton";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { mainData, setMainData } = useMainStore();

  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () =>{
      try{
        await setMainData();
        setError(false);
      } catch (err){
        setError(true);
        router.replace('/500');
      }
    };

    if(mainData.length === 0) {
      fetch();
    }
  }, [error]);


  if (error) return null;
  
  return <>
      {
        mainData.length === 0 ? (
          <Loading />
        ) : (
        <SessionProvider session={session}>
          <Head>
            <title>Seoul W</title>
            <link rel="icon" href="/favicon.ico" />
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Seoul Culture Website" />
            <meta name="copyright" content="© 2024 Seoul W Website" />
            <link rel="manifest" href="/manifest.json" />
          </Head>
          <div className="app">
            <Header />
            <Suspense
              fallback={
                <main>
                  <div>
                    <Loading />
                  </div>
                </main>
              }
            >
              <main>
                <Component {...pageProps} />
              </main>
            </Suspense>
            <TopButton />
            <Footer />
            <MenuTapBar />
          </div>
        </SessionProvider>
        )
      }
    </>
  // );
}
