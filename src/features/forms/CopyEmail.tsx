'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';

import styles from './CopyEmail.module.css';

/** The club's address with a copy button; falls back to selecting the text if copying is blocked. */
export function CopyEmail({ address }: { address: string }) {
  const t = useTranslations('forms.contact');
  const [result, setResult] = useState<'idle' | 'copied' | 'selected'>('idle');
  const addressRef = useRef<HTMLAnchorElement>(null);

  const selectAddress = () => {
    const node = addressRef.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    setResult('selected');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setResult('copied');
    } catch {
      selectAddress();
    }
  };

  return (
    <div className={styles.row}>
      <a ref={addressRef} href={`mailto:${address}`} className={styles.address}>
        {address}
      </a>
      <Button variant="ghost" onClick={copy}>
        {result === 'idle' ? t('copy') : t(result)}
      </Button>
    </div>
  );
}
