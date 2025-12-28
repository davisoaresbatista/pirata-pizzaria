import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/logo/image.png"
                alt="Pirata Pizzaria"
                width={56}
                height={56}
                className="rounded-md"
              />
            </Link>
            <p className="text-sm text-background/70">
              Venha descobrir nossos tesouros gastronômicos. Pizzas artesanais
              feitas com amor e os melhores ingredientes.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link href="/" className="hover:text-background transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/cardapio" className="hover:text-background transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-background transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-background transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div>
            <h3 className="font-semibold mb-4">Horários</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-background">Almoço</p>
                  <p>Seg a Sex: 11h às 15h</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-background">Pizzaria</p>
                  <p>Ter a Dom: 18h às 23h</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Bertioga - SP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(13) 99999-9999</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
          <p>© {new Date().getFullYear()} Pirata Pizzaria. Todos os direitos reservados.</p>
          <p>
            Desenvolvido com ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}

