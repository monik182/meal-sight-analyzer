import LandingPage from '@/app/landing/page'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <LandingPage />
}
