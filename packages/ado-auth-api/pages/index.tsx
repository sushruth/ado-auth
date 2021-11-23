import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>ADO Authenticator</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"></link>
      </Head>

      <div className={styles.container}>
        This is a website for ADO Authenticator
      </div>
    </>
  );
}
