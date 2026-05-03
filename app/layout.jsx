import { Poppins, Crimson_Text } from "next/font/google";
import "./globals.css";

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "KerjainWoi - Sekarang Juga",
  description: "KerjainWoi frontend with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${crimsonText.variable} ${poppins.variable}`}>{children}</body>
    </html>
  );
}