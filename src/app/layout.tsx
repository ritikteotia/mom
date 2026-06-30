import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MOM — AI Marketing Consultant for Small Businesses",
    template: "%s | MOM",
  },
  description:
    "MOM is your AI-powered marketing consultant. Get a personalized 30-day marketing roadmap, " +
    "campaign ideas, and audience analysis tailored to your small business.",
  keywords: [
    "AI marketing",
    "marketing consultant",
    "small business marketing",
    "30-day marketing plan",
    "marketing roadmap",
    "campaign generator",
  ],
  openGraph: {
    title: "MOM — AI Marketing Consultant",
    description:
      "Get a personalized 30-day marketing roadmap for your small business, powered by AI.",
    type: "website",
    locale: "en_US",
    siteName: "MOM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3b82f6",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
