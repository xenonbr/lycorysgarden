import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lycoris Garden | Comunidade VRChat Oficial",
  description:
    "Mais do que plantas, criamos ambientes vivos. Refúgio noturno e místico para encontros no VRChat sob o luar carmesim. Fotografia, ambientação gótica e eventos comunitários.",
  keywords: [
    "VRChat",
    "Lycoris Garden",
    "Red Spider Lily",
    "Gothic VRChat",
    "VRChat Group",
    "Fotografia Virtual",
    "Eventos Noturnos",
  ],
  authors: [{ name: "Lycoris Garden Team" }],
  openGraph: {
    title: "Lycoris Garden | Comunidade VRChat Oficial",
    description: "Mais do que plantas, criamos ambientes vivos. Junte-se ao nosso grupo no VRChat.",
    url: "https://vrc.group/LYCORI.7672",
    siteName: "Lycoris Garden",
    images: [
      {
        url: "/images/banner.jpg",
        width: 1488,
        height: 837,
        alt: "Lycoris Garden Banner Oficial",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lycoris Garden | Comunidade VRChat",
    description: "Refúgio noturno e místico no VRChat.",
    images: ["/images/banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${inter.variable} dark scroll-smooth`}>
      <body className="bg-gothic-bg text-zinc-100 font-sans selection:bg-lycoris-600 selection:text-white antialiased min-h-screen relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
