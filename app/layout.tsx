import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'德國、荷蘭之旅｜2026',description:'每日行程、交通、美食與 Claude 共編資料。'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body>{children}</body></html>}

