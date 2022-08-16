import Head from 'next/head';
import type { NextPage } from 'next';
import styles from '@styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Five Club</title>
        <meta property="og:title" content="Five Club" />
        <meta property="og:site_name" content="Five Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Five Club</h1>
      </main>
    </div>
  );
};

export default Home;
