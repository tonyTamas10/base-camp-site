'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from 'react';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { FUTURE_SPORTS_SLUG } from '@/domain/sport';
import { cx } from '@/lib/cx';

import { Brand } from '../Brand';
import styles from './SiteNavigation.module.css';

export interface NavSport {
  slug: string;
  name: string;
}

const MOBILE_QUERY = '(width < 900px)';

export function SiteNavigation({ sports }: { sports: NavSport[] }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const inEvents = pathname.startsWith('/events');

  const [menuOpen, setMenuOpen] = useState(false);
  // Sports are the main way into events, so the list starts open.
  const [eventsExpanded, setEventsExpanded] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const navId = useId();
  const sportsListId = useId();

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    if (window.matchMedia(MOBILE_QUERY).matches) menuButtonRef.current?.focus();
  }, []);

  // Navigating closes the menu and reveals the sport list inside the events section.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    if (inEvents) setEventsExpanded(true);
  }

  useEffect(() => {
    if (!menuOpen) return;
    firstItemRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  const openEventsMenu = (event: MouseEvent) => {
    if (!window.matchMedia(MOBILE_QUERY).matches) return;
    event.preventDefault();
    setEventsExpanded(true);
    setMenuOpen(true);
  };

  const sportLinks: Array<{
    href: '/events' | `/events/${string}`;
    label: string;
    future: boolean;
  }> = [
    { href: '/events', label: t('allSports'), future: false },
    ...sports.map((sport) => ({
      href: `/events/${sport.slug}` as const,
      label: sport.name,
      future: false,
    })),
    { href: `/events/${FUTURE_SPORTS_SLUG}`, label: t('futureSports'), future: true },
  ];

  const current = (href: string) => (pathname === href ? 'page' : undefined);

  return (
    <>
      <header className={styles.topBar}>
        <Brand compact />
        <span className={styles.spacer} />
        <Link href="/events" className={styles.topBarLink} onClick={openEventsMenu}>
          {t('events')}
        </Link>
        <Link href="/register" className={cx(styles.topBarLink, styles.topBarPrimary)}>
          {t('register')}
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls={navId}
          aria-label={t('openMenu')}
          onClick={() => setMenuOpen(true)}
        >
          <Icon name="menu" size={18} />
        </button>
      </header>

      <nav
        id={navId}
        className={styles.nav}
        data-open={menuOpen || undefined}
        aria-label={t('label')}
      >
        <Brand showLocation />
        <IconButton
          icon="close"
          label={t('closeMenu')}
          className={styles.close}
          onClick={closeMenu}
        />
        <ul className={styles.list}>
          <li>
            <Link ref={firstItemRef} href="/" className={styles.item} aria-current={current('/')}>
              {t('home')}
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={styles.item}
              aria-expanded={eventsExpanded}
              aria-controls={sportsListId}
              aria-current={inEvents ? 'page' : undefined}
              onClick={() => setEventsExpanded((expanded) => !expanded)}
            >
              {t('events')}
              <Icon name="right" size={14} className={styles.chevron} />
            </button>
            <ul id={sportsListId} className={styles.subList} hidden={!eventsExpanded}>
              {sportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cx(styles.subLink, link.future && styles.future)}
                    aria-current={current(link.href)}
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link href="/register" className={styles.item} aria-current={current('/register')}>
              {t('register')}
            </Link>
          </li>
          <li>
            <Link href="/sponsor" className={styles.item} aria-current={current('/sponsor')}>
              {t('sponsor')}
            </Link>
          </li>
          <li>
            <Link href="/contact" className={styles.item} aria-current={current('/contact')}>
              {t('contact')}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
