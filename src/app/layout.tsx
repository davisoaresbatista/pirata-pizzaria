import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pirata Pizzaria - Venha Descobrir Nossos Tesouros",
  description:
    "A melhor pizzaria da região. Pizzas artesanais, ambiente acolhedor e sabor incomparável. Almoço durante a semana e pizzaria à noite.",
  keywords: ["pizzaria", "pizza", "restaurante", "almoço", "delivery"],
  openGraph: {
    title: "Pirata Pizzaria",
    description: "Venha descobrir nossos tesouros gastronômicos",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
