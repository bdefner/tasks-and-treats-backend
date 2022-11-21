import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import BadChallenge from '../public/bad-challange.png';
import Beppino from '../public/beppino.jpg';
import GithubIcon from '../public/github-icon.png';
import GoodChallenge from '../public/good-challenge.png';
import Task from '../public/task.png';
import Treat from '../public/treat.png';
import styles from '../styles/Home.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tasks and treats API introduction</title>
        <meta
          name="description"
          content="This fly.io deployment serves mainly as the backend for the tasks-and-treats react native app as well as a landing page to inform about the full stack project."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navigation />
        <div className={styles.description}>
          <h1>About Tasks and Treats</h1>
        </div>
        <div className={styles.box}>
          <p>
            Tasks and Treats is a full stack project created by me, Beppino. It
            is part of my final project in the Upleveled Web-Development
            Bootcamp, Vienna, where I was in the cohort of fall 2022. The
            frontend is mainly designed as a native smartphone app, but runs in
            a browser as well.
          </p>
          <br />
          <h2>What you can do with the app</h2>
          <div className={styles.imgParagraph}>
            <Image src={Task} alt="Example of a task" />

            <div>
              <p>
                The app is meant to be a fun productivity tool. Once registered
                with an user account, you can create tasks for yourself. You
                rate these tasks on a scale from 1 - 10 stars.
              </p>
              <p>
                Once you finish a task, your budget of stars increases according
                to the given rating.
              </p>
            </div>
          </div>
          <div className={styles.imgParagraph}>
            <Image src={Treat} alt="Example of a treat" />

            <div>
              <p>
                You can also create some treats, that you would like to give to
                yourself, like "A day in the spa, fully featured!" and rate the
                treats with stars as well, from 1 - 999.
              </p>
              <p>
                Once you have enough stars collected, you can redeem your
                treats! 🤩
              </p>
            </div>
          </div>
          <div className={styles.imgParagraph}>
            <Image src={GoodChallenge} alt="Example of a challenge" />
            <Image src={BadChallenge} alt="Example of a challenge" />
            <div>
              <p>
                There are also challenges, with which you can win stars as well
                as loose some of them! 😈
              </p>
              <p>
                You can see current challenges by tabbing on the 🚀 icon in the
                app's tab menu on the bottom of the main screens.
              </p>
            </div>
          </div>
          <h2>How the app was build</h2>
          <h3>The frontend</h3>
          <p>
            The frontend was created with react native in the expo environment.
            Further technologies and Hooks include useState, useContext,
            useEffect, Lottie and secureStore. The scripts are written in JS and
            JSX.
          </p>
          <h3>The backend</h3>
          <p>
            The backend was created with Next.js and postgreSQL. Further
            technologies include ley (for migrations), playwright (for E2E and
            unit tests), bcrypt (for hashing the passwords), csfr (for creating
            secret tokens), react(for the landingpage that you are currently
            on). The api scripts are written in TypeScript, the landingpage in
            JS and JSX.
          </p>
          <h2>About me</h2>
          <div className={styles.imgParagraph}>
            <Image
              src={Beppino}
              alt="Beppino Defner, Profile"
              id={styles.profileImg}
            />
            <div className={styles.flexColumn}>
              <p>Hi, my Name is Beppino 👋 </p>
              <p>
                I am an App- and Web- Developer, based in Austria. I would be
                pleased to getting to know you, if you would want to get in
                touch!
              </p>
              <a href="https://github.com/bdefner">
                <div className={styles.BlackButton}>
                  <p>Find me on GitHub</p>
                  <Image src={GithubIcon} alt="" className={styles.icon} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
