import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  Award, 
  Heart, 
  Flame, 
  Pizza, 
  ChefHat, 
  Star,
  Instagram,
  ExternalLink,
  MapPin
} from "lucide-react";

// Dados centralizados da Pizzaria
const PIZZARIA_INFO = {
  nome: "Pirata Pizzaria",
  endereco: "Av. Vicente de Carvalho, 48 - Centro",
  cidade: "Bertioga - SP",
  telefone: "(13) 99747-3947",
  whatsapp: "5513997473947",
  instagram: "pirata_pizzaria",
  googleMaps: "https://maps.app.goo.gl/CSJCJvA1AaHY6DrF7",
  ifood: "https://www.ifood.com.br/delivery/bertioga-sp/pirata-pizzaria-bertioga-centro/95f172e2-1048-45be-a02f-5c78ada13507",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header - Preto e Vermelho */}
      <section className="relative bg-[#0a0a0a] py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <span className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10">
              🏴‍☠️ Nossa História
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre a <span className="text-red-500">Pirata Pizzaria</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Uma jornada de sabor, paixão e dedicação à arte de fazer as melhores pizzas de Bertioga
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl border border-neutral-200">
              <Image
                src="/logo/image.png"
                alt="Pirata Pizzaria"
                width={350}
                height={350}
                className="object-contain drop-shadow-xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Pizza className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-neutral-900 rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium border border-red-100">
              <Flame className="h-4 w-4" />
              Tradição & Sabor
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-neutral-900">
              Venha Descobrir Nossos <span className="text-red-600">Tesouros</span> Gastronômicos
            </h2>
            <div className="space-y-4 text-neutral-600 text-lg leading-relaxed">
              <p>
                A <strong className="text-neutral-900">Pirata Pizzaria</strong> nasceu do sonho de criar um lugar onde a boa comida
                e o ambiente acolhedor se encontram. Nossa jornada começou com uma
                paixão: fazer as melhores pizzas artesanais de Bertioga.
              </p>
              <p>
                Cada pizza que sai do nosso forno carrega consigo anos de experiência,
                ingredientes cuidadosamente selecionados e o amor pelo que fazemos.
                Nossa massa passa por <strong className="text-neutral-900">48 horas de fermentação natural</strong>, resultando em
                uma textura leve e um sabor incomparável.
              </p>
              <p>
                Durante o dia, nos transformamos em um restaurante aconchegante, servindo
                deliciosos <strong className="text-neutral-900">pratos executivos</strong> para quem busca uma refeição saborosa e
                rápida. À noite, as luzes se aquecem e o aroma das pizzas toma conta
                do ambiente.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href={`https://instagram.com/${PIZZARIA_INFO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-neutral-900 hover:bg-neutral-800">
                  <Instagram className="h-5 w-5 mr-2" />
                  Siga no Instagram
                </Button>
              </a>
              <Link href="/cardapio">
                <Button variant="outline" className="border-neutral-300">
                  Ver Cardápio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Vermelho */}
      <section className="bg-red-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">48h</div>
              <p className="text-white/80 text-sm">Fermentação Natural</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <p className="text-white/80 text-sm">Ingredientes Frescos</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <Star className="h-10 w-10 inline" />
              </div>
              <p className="text-white/80 text-sm">Qualidade Premium</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">❤️</div>
              <p className="text-white/80 text-sm">Feito com Amor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-red-100">
              🎯 O que nos move
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">Nossos Valores</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              Princípios que guiam cada decisão e cada pizza que preparamos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-white">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-neutral-900">Qualidade</h3>
                <p className="text-sm text-neutral-600">
                  Ingredientes premium selecionados e processos rigorosos de preparação
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-white">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-neutral-900">Paixão</h3>
                <p className="text-sm text-neutral-600">
                  Amor genuíno pela gastronomia refletido em cada detalhe
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-white">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-neutral-900">Família</h3>
                <p className="text-sm text-neutral-600">
                  Ambiente acolhedor onde todos são bem-vindos
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-white">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-neutral-900">Tradição</h3>
                <p className="text-sm text-neutral-600">
                  Receitas e técnicas aprimoradas ao longo do tempo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Horários */}
      <section className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-white text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-neutral-200">
                🕐 Quando nos visitar
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">Horários de Funcionamento</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl overflow-hidden bg-white">
                <div className="bg-neutral-900 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Restaurante</h3>
                      <p className="text-white/80 text-sm">Pratos executivos</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-neutral-600">Segunda a Sexta</span>
                      <span className="font-bold text-lg text-neutral-900">11h às 15h</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-neutral-600">Sábado e Domingo</span>
                      <span className="font-medium text-red-600">Fechado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-xl overflow-hidden bg-white">
                <div className="bg-red-600 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Pizzaria</h3>
                      <p className="text-white/80 text-sm">Pizzas artesanais</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-neutral-600">Terça a Quinta</span>
                      <span className="font-bold text-lg text-neutral-900">18h às 23h</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <span className="text-neutral-600">Sexta a Domingo</span>
                      <span className="font-bold text-lg text-neutral-900">18h às 00h</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-neutral-600">Segunda</span>
                      <span className="font-medium text-red-600">Fechado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Localização e CTA */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl overflow-hidden bg-[#0a0a0a] text-white">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    📍 Venha nos Visitar!
                  </h3>
                  <div className="space-y-3 text-white/70 mb-6">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-red-500" />
                      <span>
                        {PIZZARIA_INFO.endereco}<br />
                        {PIZZARIA_INFO.cidade}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={PIZZARIA_INFO.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" className="font-semibold">
                        <MapPin className="h-4 w-4 mr-2" />
                        Ver no Mapa
                      </Button>
                    </a>
                    <a
                      href={PIZZARIA_INFO.ifood}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-red-600 hover:bg-red-700 font-semibold">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Pedir no iFood
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="text-center">
                    <a
                      href={`https://instagram.com/${PIZZARIA_INFO.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <div className="w-32 h-32 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mb-4 hover:scale-105 hover:bg-white/20 transition-all shadow-xl">
                        <Instagram className="h-16 w-16 text-white" />
                      </div>
                      <p className="font-bold text-lg">@{PIZZARIA_INFO.instagram}</p>
                      <p className="text-white/60 text-sm">Siga-nos no Instagram!</p>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
