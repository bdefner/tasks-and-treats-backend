import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import styles from '../styles/Home.module.css';

export default function ApiPage() {
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
          <h1>The API</h1>
          <div className={styles.box}>
            <p>
              This API serves the react native app and is used for user
              registration, updating user information and preferences, login,
              logout, creating tasks & treats, fetch "challenges" and check if
              the users have achieved the challenges.
            </p>
            <p>
              However, you can use the api for your own projects, if you find it
              fun to do so. On this page you can read about the endpoints, what
              they need to receive in order to work and what you will get as a
              successful response.
            </p>
          </div>
        </div>
        <div className={styles.columnWrap}>
          <div className={styles.box}>
            <div className={styles.listWrap}>
              <h2>Endpoints</h2>
              <ul>
                <li>
                  <div>
                    <span>/api/signup</span>
                    <p>Type: POST</p>
                    <p>Request body: 'username', 'email' and 'password'</p>
                    <p>Response: 'userId', 'sessionToken'</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/login</span>
                    <p>Type: POST</p>
                    <p>Request body: 'username', 'password'</p>
                    <p>Response: 'userId', 'userEmail', budget, sessionToken</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/auth</span>
                    <p>Type: POST</p>
                    <p>Request body: 'userId', 'sessionToken'</p>
                    <p>Response: 'username, userId', 'userEmail', budget</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/logout</span>
                    <p>Type: POST</p>
                    <p>Request body: 'userId', 'sessionToken'</p>
                    <p>Response: 'success: "Session token deleted"</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/getcarts</span>
                    <p>Type: POST</p>
                    <p>Request body: 'userId', 'sessionToken'</p>
                    <p>Response: 'carts'</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/getchallenges</span>
                    <p>Type: POST</p>
                    <p>Request body: 'userId', 'sessionToken'</p>
                    <p>Response: 'challenges'</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/createcart</span>
                    <p>Type: POST</p>
                    <p>
                      Request body: 'userId', 'sessionToken', 'timeOfCreation',
                      'typeId', 'label', 'rating', 'statusId'
                    </p>
                    <p>Response: 'cartId'</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/updatecart</span>
                    <p>Type: POST</p>
                    <p>
                      Request body: 'userId', 'sessionToken', 'timeOfCreation',
                      'typeId', 'label', 'rating', 'statusId'
                    </p>
                    <p>Response: 'cartId'</p>
                  </div>
                </li>
                <li>
                  <div>
                    <span>/api/deletecart</span>
                    <p>Type: POST</p>
                    <p>Request body: 'userId', 'sessionToken', 'cartId'</p>
                    <p>Response: 'cartId'</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.limitWidth}>
              <h2>Legend</h2>

              <p>The following objects and types are used by the api.</p>
              <div className={styles.codeWrap}>
                {' '}
                {'user: {'}
                <br />
                userId: number;
                <br /> username: string;
                <br /> userEmail: string;
                <br /> sessionToken: string
              </div>
              <br />
              <div className={styles.codeWrap}>
                <p>
                  {
                    'cart: { userId: number, timeOfCreation: Date, typeId: number, label: string, rating: number, dueDate: Date | null, statusId: number, assignedToUserId: number | null, receivedFromUserId: number | null, groupId: number | null }'
                  }
                </p>
              </div>
              <br />
              <div className={styles.codeWrap}>
                <p>
                  {
                    'challenges: { challengeId: number; label: string; description: string; reward: number; }'
                  }
                </p>
              </div>
              <br />

              <span>typeId</span>
              <p>1: a task</p>
              <p>2: a treat</p>
              <span>statusId</span>
              <p>1: in process </p>
              <p>2: done </p>
              <p>3: pending </p>
              <p>4: accepted </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
