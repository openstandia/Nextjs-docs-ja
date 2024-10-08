import React from 'react'
import DocusaurusDocCardList from '@theme/DocCardList'
import styles from './doc.module.css'

export const DocCardList = () => {
  return (
    <nav className={styles.container}>
      <DocusaurusDocCardList />
    </nav>
  )
}
