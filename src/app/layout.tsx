import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme'
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haive | The Ultimate AI Chatbot",
  description: "Discover the ultimate AI chatbot experience with Haive where expert HiveBots provide instant, specialized insights just for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <body className={outfit.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
