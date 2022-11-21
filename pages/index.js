import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import appOnIphone from '../public/app-on-iphone.png';
import gitHubIcon from '../public/github-icon.png';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tasks-and-treats-landingpage</title>
        <meta
          name="description"
          content="This fly.io deployment serves mainly as the backend for the tasks-and-treats react native app as well as a landing page to inform about the full stack project."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Navigation />

        <container className={styles.pageContainer}>
          <h1>
            Welcome to <span className={styles.greenText}>Tasks</span> &{' '}
            <span className={styles.purpleText}>Treats!</span>
          </h1>
          <div className={styles.columnWrap}>
            <Image
              src={appOnIphone}
              alt="The app on an iPhone"
              id={styles.phone}
            />
            <div className={styles.paragraphWrap}>
              <span>A get-things-done app that's fun to use!</span>
              <p>
                ⭐ Earn stars by doing things that you used to procrastinate.
                Then trade these stars to treat yourself with something special
                😊
              </p>
              <p>
                🚀 The app is currently in alpha state. This means it's not yet
                available on the AppStore or PlayStore, but you can already run
                it by cloning my repository on GitHub. Please follow the
                instructions in the README.md file and reach out to me, if you
                have any questions!
              </p>
              <p>
                🤖 Also feel free to play around with the API and use it for
                your own project, if you like!
              </p>
              <a href="https://github.com/bdefner/tasks-and-treats-react-native-project">
                <div className={styles.BlackButton}>
                  <p>see on GitHub</p>
                  <Image src={gitHubIcon} alt="" className={styles.icon} />
                </div>
              </a>
            </div>
          </div>
        </container>
      </main>

      {/* <footer className={styles.footer}></footer> */}
    </div>
  );
}
