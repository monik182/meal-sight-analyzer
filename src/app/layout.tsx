import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Meal Analyzer',
  description: 'Web site created with Lovable.', // TODO: update this
  openGraph: {
    title: 'Meal Analyzer',
    description: 'Web site created with Lovable.', // TODO: update this
    url: 'https://meal-sight-analyzer.vercel.app/',
    siteName: 'Meal Analyzer',
    images: [
      {
        url: 'https://lovable.dev/opengraph-image-p98pqg.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* <title>meal-sight-analyzer</title> */}
        {/* <meta name="description" content="Lovable Generated Project" />
        <meta name="author" content="Lovable" />

        <meta property="og:title" content="meal-sight-analyzer" />
        <meta property="og:description" content="Lovable Generated Project" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lovable_dev" />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" /> */}
      </head>

      <body>
        <div id="root">{children}</div>
        {/* <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! --> */}
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
        {/* <script type="module" src="../src/main.tsx"></script> */}
      </body>
    </html>
  )
}
