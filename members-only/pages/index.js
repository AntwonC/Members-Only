import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Home() {

  const router = useRouter();
  
  return (
    <div className={styles.divContainer}>
      <button className={styles.signUpButton}>
        <Link href="/clickedSignUp/signup">Sign Up</Link>
      </button>
    </div>
  )
}
