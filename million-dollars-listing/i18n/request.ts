// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  return {
    locale: locale ?? 'es',
    messages: (await import(`./${locale ?? 'es'}.json`)).default,
  };
});
