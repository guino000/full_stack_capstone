import utilStyles from '../styles/utils.module.css';
import React from 'react';

export default function Home() {
  return (
    <>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </>
  );
}
