import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';


export default function Home() {
  return (
    <div className={styles.divContainer}>
      <button className={styles.signUpButton}>
        <Link href="/clickedSignUp/signup">Sign Up</Link>
      </button>
    </div>
  )
}
