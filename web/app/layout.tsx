import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "Neato Voice | Future of Business AI",
  description: "AI Tools That Actually Work For Your Business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${spaceMono.variable} antialiased bg-bg-primary text-text-primary overflow-x-hidden font-body`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof process === 'undefined') { 
                window.process = { env: {}, versions: {} }; 
              } else if (!process.versions) {
                process.versions = {};
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
