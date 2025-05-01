import Index from '@/pages/Index'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <Index />  // We'll update this
}
