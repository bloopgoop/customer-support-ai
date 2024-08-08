import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Background from "./background";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import Header from "@/lib/firebase/session-hook";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "./globals.css";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haive | The Ultimate AI Chatbot",
  description:
    "Discover the ultimate AI chatbot experience with Haive where expert HiveBots provide instant, specialized insights just for you",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = await getAuthenticatedAppForUser();
  // useUserSession(currentUser?.toJSON());

  return (
    <html lang="en">
      <body className={outfit.className}>
        <Header initialUser={currentUser?.toJSON()} />
        <ThemeProvider theme={theme}>
          <Background>{children}</Background>
        </ThemeProvider>
      </body>
    </html>
  );
}
