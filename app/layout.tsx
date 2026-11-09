import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawgress | Your coding companion",
  description: "A tiny cat companion for your open source journey.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
