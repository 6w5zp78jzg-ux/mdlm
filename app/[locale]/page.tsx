import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('hero');

  return (
    <main style={{ background: '#0a0a0a', color: '#c9a96e', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>MILLION DOLLARS LISTING</h1>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 300 }}>MARBELLA</h2>
      <p style={{ marginTop: '2rem', opacity: 0.7 }}>{t('tagline')}</p>
    </main>
  );
}