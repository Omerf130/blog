'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './PublicHeader.module.scss';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <h1>⚖️ משרד עורכי דין קשת</h1>
        </Link>

        {/* Hamburger Button */}
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
          onClick={toggleMenu}
          aria-label="תפריט"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <Link href="/" onClick={closeMenu}>ראשי</Link>
          <Link href="/posts" onClick={closeMenu}>מאמרים</Link>
          <Link href="/categories" onClick={closeMenu}>קטגוריות</Link>
          <Link href="/about" onClick={closeMenu}>אודות</Link>
          <Link href="/contact" onClick={closeMenu}>צור קשר</Link>
          <Link href="/login" className={styles.loginLink} onClick={closeMenu}>התחבר</Link>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}
    </header>
  );
}

