import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ApolloWrapper from "./ApolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwasthiQ EMR - Appointment Management",
  description: "Healthcare appointment management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
