import './globals.css'
import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from 'next/font/google'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Socket Chat',
  description: 'Chat local construído utilizando conexão via socket',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  	return (
		<html lang="en">
			<body
				className={`${inter.className} min-h-screen`}
			>
				<Providers>
					{children}
					<SpeedInsights />
				</Providers>
			</body>
		</html>
  	);
}
