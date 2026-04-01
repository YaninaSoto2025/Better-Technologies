import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Better Technologies | Build and validate in 72h",
  description: "Public Venture Lab. We build and validate businesses in public.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}