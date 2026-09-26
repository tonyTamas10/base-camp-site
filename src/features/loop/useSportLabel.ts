'use client';

import { useTranslations } from 'next-intl';

import { FUTURE_SPORTS_SLUG } from '@/domain/sport';

import { useLoop } from './LoopProvider';

/** Human label for the current sport selection: "all sports", "future sports" or the sport name. */
export function useSportLabel(): string {
  const t = useTranslations('loop');
  const { sport, sports } = useLoop();
  if (sport === 'all') return t('allSports');
  if (sport === FUTURE_SPORTS_SLUG) return t('futureSports');
  return sports.find((s) => s.slug === sport)?.name ?? sport;
}
