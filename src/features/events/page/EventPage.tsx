import { getTranslations } from 'next-intl/server';
import { Fragment } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';

import { EventHero } from './EventHero';
import { applicableModules, EVENT_MODULES } from './modules/registry';
import type { EventModuleProps } from './modules/types';
import { ProgressRail } from './ProgressRail';

/** An event's story: the hero, then its modules in the order the editor chose. */
export async function EventPage(props: EventModuleProps) {
  const t = await getTranslations('eventPage');
  const { event, sports } = props;
  const modules = applicableModules(event);

  return (
    <>
      <EventHero event={event} sport={sports.find((sport) => sport.slug === event.sportSlug)} />
      {modules.map((type) => {
        const Module = EVENT_MODULES[type].component;
        return (
          <Fragment key={type}>
            <Module {...props} />
          </Fragment>
        );
      })}
      <SiteFooter />
      <ProgressRail
        label={t('railLabel')}
        sections={modules.map((type) => ({ id: type, label: t(`modules.${type}`) }))}
      />
    </>
  );
}
