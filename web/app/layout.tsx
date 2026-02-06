import type { Metadata } from "next";
import { Share_Tech_Mono, Jost } from "next/font/google";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-share-tech',
});

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
});

export const metadata: Metadata = {
  title: "Neato Voice | Future of Business AI",
  description: "Enterprise-grade intelligence for the modern industrial age.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${shareTechMono.variable} ${jost.variable} antialiased bg-vault-navy text-vault-paper overflow-x-hidden`}
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
