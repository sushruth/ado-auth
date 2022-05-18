import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { SERVER_PORT } from '../lib/constants'
import styles from '../styles/Home.module.css'

export default function Process(): JSX.Element {
  const [done, setDone] = useState(false)
  const timeout = useRef(-1)

  useEffect(() => {
    const body = localStorage.getItem('token')
    if (!done && body) {
      if (location.search) {
        const query = new URLSearchParams(location.search)
        fetch(`http://localhost:${query.get('port') || SERVER_PORT}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body,
        }).then(() => {
          setDone(true)
          localStorage.removeItem('token')
        })
      }
    }
  }, [done])

  // Handling timeout
  useEffect(() => {
    if (timeout.current === -1) {
      timeout.current = window.setTimeout(() => {
        window.close()
      }, 1000)
    }
  }, [])

  return (
    <>
      <Head>
        <title>ADO Authenticator</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"></link>
      </Head>

      <div className={styles.container}>
        {done ? (
          <>
            <h1>Authentication complete</h1>
            <b>Attempting to close the page in a few seconds...</b>
            <span>
              If this page does not close automatically, you can now close the
              window anyway
            </span>
          </>
        ) : (
          <h1>Please wait!</h1>
        )}
      </div>
    </>
  )
}
