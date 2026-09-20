import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'Konfigurátor dekorů', description:'Vyzkoušejte si různé kombinace dekorů oken, dveří, fasády a střechy.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="cs"><body>{children}</body></html>; }
