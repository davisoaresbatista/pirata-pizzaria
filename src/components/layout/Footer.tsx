import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Dados da Pizzaria (Google Maps: https://maps.app.goo.gl/CSJCJvA1AaHY6DrF7)
const PIZZARIA_INFO = {
  nome: "Pirata Pizzaria",
  endereco: "Av. Vicente de Carvalho, 48 - Centro",
  cidade: "Bertioga - SP",
  cep: "11250-045",
  telefone: "(13) 99747-3947",
  whatsapp: "(13) 99747-3947",
  instagram: "pirata_pizzaria",
  googleMaps: "https://maps.app.goo.gl/CSJCJvA1AaHY6DrF7",
  ifood: "https://www.ifood.com.br/delivery/bertioga-sp/pirata-pizzaria-bertioga-centro/95f172e2-1048-45be-a02f-5c78ada13507",
};

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
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
            <p className="text-sm text-white/60">
              Venha descobrir nossos tesouros gastronômicos. Pizzas artesanais
              feitas com amor e os melhores ingredientes.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/cardapio" className="hover:text-white transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Horários</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="font-medium text-white">Almoço</p>
                  <p>Seg a Sex: 11h às 15h</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="font-medium text-white">Pizzaria</p>
                  <p>Ter a Dom: 18h às 23h</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contato</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a 
                  href={PIZZARIA_INFO.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-white transition-colors"
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                  <span>{PIZZARIA_INFO.endereco}<br />{PIZZARIA_INFO.cidade}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`tel:+55${PIZZARIA_INFO.telefone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{PIZZARIA_INFO.telefone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/55${PIZZARIA_INFO.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-400 transition-colors"
                >
                  <svg className="h-4 w-4 shrink-0 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>{PIZZARIA_INFO.whatsapp}</span>
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href={`https://instagram.com/${PIZZARIA_INFO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={PIZZARIA_INFO.ifood}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-red-500 transition-colors"
                aria-label="iFood"
                title="Peça pelo iFood"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© {new Date().getFullYear()} Pirata Pizzaria. Todos os direitos reservados.</p>
          <p>
            Desenvolvido com ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
