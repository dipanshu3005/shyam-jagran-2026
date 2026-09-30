import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://guptas-khatu-shyam-jagran-2026.dipanshugupta3005.chatgpt.site";
const shareTitle = "Khatu Shyam Ji Jagran | Gupta’s Family";
const shareDescription =
  "With love and devotion, the Gupta Family cordially invites you to Shri Khatu Shyam Ji Jagran on Monday, 26 October 2026 at Sector 10A, Gurgaon.";
const shareImage = `${siteUrl}/art/khatu-shyam-cartoon-v2.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shri Shyam Sankirtan Sandhya | Gupta's Family",
  description:
    "With love and devotion, Gupta's Family invites you to Shri Shyam Sankirtan Sandhya on 26 October 2026 at 9:00 PM in Gurugram.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: shareTitle,
    description: shareDescription,
    siteName: "Gupta’s Family Invitation",
    images: [
      {
        url: shareImage,
        width: 1145,
        height: 1374,
        alt: "Illustrated portrait of Shri Khatu Shyam Ji",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
