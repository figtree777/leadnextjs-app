import Head from "next/head";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>leadnextjs | Landing Page</title>
        <meta name="description" content="Leadnextjs - Modern Next.js Landing Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <main className={styles.main} style={{ width: '100%', maxWidth: 600, textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--container-bg)', borderRadius: '12px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-1px' }}>leadnextjs</h1>
          <p style={{ fontSize: '1.25rem', color: '#555', marginBottom: '2rem' }}>
            A modern Next.js starter for your next big idea. Fast, flexible, and production ready.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/get-started" legacyBehavior>
              <a
                style={{
                  display: 'inline-block',
                  background: '#0070f3',
                  color: '#fff',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#0059c1')}
                onMouseOut={e => (e.currentTarget.style.background = '#0070f3')}
              >
                Get Started
              </a>
            </Link>
            <Link href="/register" legacyBehavior>
              <a
                style={{
                  display: 'inline-block',
                  background: 'var(--container-bg)',
                  color: 'var(--text-primary)',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: '1px solid var(--border-color)',
                  transition: 'background 0.2s'
                }}
              >
                Register
              </a>
            </Link>
          </div>
        </main>
        <footer style={{ marginTop: 'auto', padding: '2rem 0', color: '#aaa', fontSize: '0.95rem' }}>
          &copy; {new Date().getFullYear()} leadnextjs. All rights reserved.
        </footer>
      </div>
    </>
  );
}
