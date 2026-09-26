import { useTranslations } from 'next-intl';

import { Tag, type TagTone } from '@/components/ui/Tag';
import type { EventStatus } from '@/domain/event';

const TONES: Record<EventStatus, TagTone> = {
  past: 'default',
  'this-week': 'inverted',
  upcoming: 'signal',
};

export function EventStatusTag({ status, className }: { status: EventStatus; className?: string }) {
  const t = useTranslations('eventStatus');
  return (
    <Tag tone={TONES[status]} className={className}>
      {t(status)}
    </Tag>
  );
}
