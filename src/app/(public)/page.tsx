import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Flame, Star, Sparkles, ArrowRight, ChevronDown, Instagram } from "lucide-react";

// Dados da Pizzaria (Google Maps: https://maps.app.goo.gl/CSJCJvA1AaHY6DrF7)
const PIZZARIA_INFO = {
  nome: "Pirata Pizzaria",
  endereco: "Av. Vicente de Carvalho, 48 - Centro",
  cidade: "Bertioga - SP",
  cep: "11250-045",
  telefone: "(13) 99747-3947",
  whatsapp: "(13) 99747-3947",
  instagram: "@piratapizzaria",
  googleMaps: "https://maps.app.goo.gl/CSJCJvA1AaHY6DrF7",
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Full Screen Immersive */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[150px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[180px]" />
          
          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Diamond Shape - Abstract Logo Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] opacity-[0.07]">
          <div className="w-full h-full rotate-45 border border-red-500/50 rounded-3xl" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[380px] md:h-[380px] opacity-[0.05]">
          <div className="w-full h-full rotate-45 border border-red-400/50 rounded-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-red-500">🏴‍☠️</span>
            <span className="text-sm text-white/70 font-medium tracking-wide">Pizzaria Artesanal em Bertioga</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            <span className="block">Venha Descobrir</span>
            <span className="block mt-2 bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent">
              Nossos Tesouros
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
            Pizzas artesanais com massa de fermentação natural de 48 horas, 
            ingredientes selecionados e sabores que contam histórias.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 text-base bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25" 
              asChild
            >
              <Link href="/cardapio">
                Ver Cardápio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="h-14 px-8 text-base bg-transparent border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              asChild
            >
              <a href={`https://wa.me/55${PIZZARIA_INFO.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-5 w-5" />
                Fazer Pedido
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">+50</div>
              <div className="text-sm text-white/50 mt-1">Sabores</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">48h</div>
              <div className="text-sm text-white/50 mt-1">Fermentação</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">5★</div>
              <div className="text-sm text-white/50 mt-1">Avaliação</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Explore</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-red-500 text-sm font-semibold tracking-widest uppercase mb-4">
              Por que somos diferentes
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              A Arte da Pizza Perfeita
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <Card className="group relative bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden hover:border-red-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative p-8">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Flame className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Massa Artesanal</h3>
                <p className="text-white/60 leading-relaxed">
                  Fermentação natural de 48 horas que resulta em uma massa leve, crocante por fora e macia por dentro.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="group relative bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden hover:border-red-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative p-8">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Star className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Ingredientes Premium</h3>
                <p className="text-white/60 leading-relaxed">
                  Selecionamos os melhores ingredientes: muçarela de búfala, tomates San Marzano e azeites especiais.
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="group relative bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden hover:border-red-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative p-8">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Receitas Exclusivas</h3>
                <p className="text-white/60 leading-relaxed">
                  Combinações únicas criadas pelos nossos chefs, unindo tradição italiana com sabores brasileiros.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Horários Section */}
      <section className="py-24 bg-[#0f0f0f] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block text-red-500 text-sm font-semibold tracking-widest uppercase mb-4">
                Horários
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Duas Experiências,
                <br />
                <span className="text-red-500">Um Só Lugar</span>
              </h2>
              <p className="text-lg text-white/60 mb-10 max-w-md">
                Durante o dia, um restaurante acolhedor com pratos executivos. 
                À noite, nos transformamos na melhor pizzaria de Bertioga.
              </p>

              <div className="space-y-4">
                {/* Almoço */}
                <div className="group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/30 transition-colors">
                    <Clock className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">Restaurante</h4>
                    <p className="text-white/60">Segunda a Sexta • 11h às 15h</p>
                  </div>
                </div>

                {/* Pizzaria */}
                <div className="group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/30 transition-colors">
                    <Flame className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">Pizzaria</h4>
                    <p className="text-white/60">Terça a Domingo • 18h às 23h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Abstract Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Background circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-white/10" />
                </div>
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-white/5" />
                </div>
                <div className="absolute inset-16 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-red-500/20" />
                </div>
                
                {/* Center element - Diamond */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rotate-45 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-2xl shadow-red-500/30 flex items-center justify-center">
                    <span className="text-4xl -rotate-45">🍕</span>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-12 right-12 w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🧀</span>
                </div>
                <div className="absolute bottom-12 left-12 w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="absolute bottom-24 right-8 w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                  <span className="text-xl">🍅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Localização Section */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-red-500 text-sm font-semibold tracking-widest uppercase mb-4">
              Onde Estamos
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Venha Nos Visitar
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Map Card - Link para Google Maps */}
            <a 
              href={PIZZARIA_INFO.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="group block aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 hover:border-red-500/30 transition-all duration-300 relative"
            >
              {/* Background Pattern - Simula Mapa */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Linhas de rua simuladas */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
              </div>

              {/* Conteúdo Central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                {/* Pin animado */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 w-20 h-20 bg-red-500/30 rounded-full animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-10 w-10 text-red-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">Pirata Pizzaria</h3>
                <p className="text-white/60 mb-1">{PIZZARIA_INFO.endereco}</p>
                <p className="text-white/60 mb-6">{PIZZARIA_INFO.cidade}</p>
                
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium group-hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25">
                  <MapPin className="h-4 w-4" />
                  Ver no Google Maps
                </span>
              </div>
            </a>

            {/* Info Cards */}
            <div className="space-y-4">
              {/* Endereço */}
              <a 
                href={PIZZARIA_INFO.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/30 transition-colors">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">Endereço</h4>
                  <p className="text-white/60">{PIZZARIA_INFO.endereco}</p>
                  <p className="text-white/60">{PIZZARIA_INFO.cidade}</p>
                </div>
              </a>

              {/* Telefone */}
              <a 
                href={`tel:+55${PIZZARIA_INFO.telefone.replace(/\D/g, '')}`}
                className="group flex items-center gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/30 transition-colors">
                  <Phone className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">Telefone</h4>
                  <p className="text-white/60">{PIZZARIA_INFO.telefone}</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a 
                href={`https://wa.me/55${PIZZARIA_INFO.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 p-6 rounded-2xl bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0 group-hover:bg-green-500/30 transition-colors">
                  <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">WhatsApp</h4>
                  <p className="text-green-400">{PIZZARIA_INFO.whatsapp}</p>
                </div>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/piratapizzaria"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 p-6 rounded-2xl bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0 group-hover:bg-pink-500/30 transition-colors">
                  <Instagram className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">Instagram</h4>
                  <p className="text-pink-400">{PIZZARIA_INFO.instagram}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-950">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <span className="inline-block text-red-200 text-sm font-semibold tracking-widest uppercase mb-4">
            Faça seu pedido
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pronto Para Embarcar
            <br />
            Nessa Aventura?
          </h2>
          <p className="max-w-xl mx-auto text-white/70 mb-10 text-lg">
            Visite-nos em Bertioga ou peça pelo delivery. 
            Nossa tripulação está pronta para servir os melhores tesouros da casa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 text-base bg-white text-red-900 hover:bg-white/90 shadow-lg font-semibold"
              asChild
            >
              <a href={`https://wa.me/55${PIZZARIA_INFO.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-5 w-5" />
                Fazer Pedido
              </a>
            </Button>
            <Button 
              size="lg" 
              className="h-14 px-8 text-base bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold"
              asChild
            >
              <a href={PIZZARIA_INFO.googleMaps} target="_blank" rel="noopener noreferrer">
                <MapPin className="mr-2 h-5 w-5" />
                Como Chegar
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
