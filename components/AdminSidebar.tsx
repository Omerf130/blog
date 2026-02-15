'use client';

import { useState } from 'react';
import styles from '../app/(admin)/admin/admin-layout.module.scss';

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger - only visible on mobile via CSS */}
      <button
        className={styles.hamburger}
        onClick={() => setOpen(true)}
        aria-label="פתח תפריט"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
          aria-label="סגור תפריט"
        >
          ✕
        </button>
        {children}
      </aside>
    </>
  );
}

