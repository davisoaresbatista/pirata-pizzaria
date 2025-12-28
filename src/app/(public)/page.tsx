import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Utensils, Pizza, ChefHat } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium border border-primary/30">
                🏴‍☠️ A melhor pizza da região
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Venha Descobrir
                <br />
                <span className="text-gradient">Nossos Tesouros</span>
              </h1>
              <p className="text-lg text-white/70 max-w-md">
                Pizzas artesanais preparadas com ingredientes selecionados,
                massa fresca e muito amor. Uma experiência gastronômica única.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/cardapio">Ver Cardápio</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contato">Fazer Pedido</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                <Image
                  src="/logo/image.png"
                  alt="Pirata Pizzaria"
                  fill
                  className="object-contain p-8"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por Que Escolher a Pirata?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa paixão pela culinária nos guia a oferecer sempre o melhor para você
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Pizza className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Massa Artesanal</h3>
                <p className="text-muted-foreground">
                  Nossa massa é preparada diariamente com fermentação natural de 48 horas
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chefs Experientes</h3>
                <p className="text-muted-foreground">
                  Nossa equipe é formada por profissionais apaixonados pela gastronomia
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ingredientes Premium</h3>
                <p className="text-muted-foreground">
                  Selecionamos os melhores ingredientes para garantir sabor e qualidade
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hours Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Horários de Funcionamento
              </span>
              <h2 className="text-3xl font-bold mt-2 mb-6">
                Almoço Durante a Semana,
                <br />
                Pizzaria à Noite
              </h2>
              <p className="text-muted-foreground mb-8">
                Durante o dia servimos deliciosos pratos executivos. À noite, nos transformamos
                em uma pizzaria acolhedora com as melhores pizzas artesanais da região.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Restaurante (Almoço)</h4>
                    <p className="text-sm text-muted-foreground">Segunda a Sexta: 11h às 15h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Pizza className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Pizzaria</h4>
                    <p className="text-sm text-muted-foreground">Terça a Domingo: 18h às 23h</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-secondary rounded-3xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <Pizza className="h-24 w-24 text-primary/20 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Imagem do ambiente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto Para Uma Experiência Única?
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto mb-8">
            Venha nos visitar ou faça seu pedido para delivery. Nossa equipe está pronta
            para lhe atender e proporcionar momentos deliciosos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contato">
                <Phone className="h-4 w-4 mr-2" />
                Fazer Pedido
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-background border-background/30 hover:bg-background/10" asChild>
              <Link href="/contato">
                <MapPin className="h-4 w-4 mr-2" />
                Como Chegar
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

