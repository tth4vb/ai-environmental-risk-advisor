'use client';

import { useTranslation, Locale } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const locales: Locale[] = ['en', 'id', 'es'];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger className="w-auto h-8 gap-1.5 text-sm border-none shadow-none px-2">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {t(`languageSwitcher.${l}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
