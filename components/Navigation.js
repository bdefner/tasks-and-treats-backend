import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Navigation() {
  return (
    <div id={styles.navWrap}>
      <Link href="/" className={styles.navLink}>
        Home
      </Link>
      <Link href="/apiPage" className={styles.navLink}>
        Api
      </Link>
      <Link href="/about" className={styles.navLink}>
        About
      </Link>
    </div>
  );
}
