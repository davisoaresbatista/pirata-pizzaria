import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Award, Heart } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Nossa História
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Sobre a Pirata Pizzaria
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Uma jornada de sabor, paixão e dedicação à arte de fazer pizzas
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square bg-secondary rounded-3xl overflow-hidden flex items-center justify-center">
              <Image
                src="/logo/image.png"
                alt="Pirata Pizzaria"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Venha Descobrir Nossos Tesouros</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                A Pirata Pizzaria nasceu do sonho de criar um lugar onde a boa comida
                e o ambiente acolhedor se encontram. Nossa jornada começou com uma
                paixão: fazer as melhores pizzas artesanais da região.
              </p>
              <p>
                Cada pizza que sai do nosso forno carrega consigo anos de experiência,
                ingredientes cuidadosamente selecionados e o amor pelo que fazemos.
                Nossa massa passa por 48 horas de fermentação natural, resultando em
                uma textura leve e um sabor incomparável.
              </p>
              <p>
                Durante o dia, nos transformamos em um restaurante aconchegante, servindo
                deliciosos pratos executivos para quem busca uma refeição saborosa e
                rápida. À noite, as luzes se aquecem e o aroma das pizzas toma conta
                do ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Princípios que guiam cada decisão e cada pizza que preparamos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Ingredientes premium e processos rigorosos
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Paixão</h3>
                <p className="text-sm text-muted-foreground">
                  Amor pela gastronomia em cada detalhe
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Família</h3>
                <p className="text-sm text-muted-foreground">
                  Ambiente acolhedor para todos
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md text-center">
              <CardContent className="pt-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Tradição</h3>
                <p className="text-sm text-muted-foreground">
                  Receitas passadas de geração em geração
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Horários de Funcionamento</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Restaurante (Almoço)</h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex justify-between">
                    <span>Segunda a Sexta</span>
                    <span className="font-medium text-foreground">11h às 15h</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sábado e Domingo</span>
                    <span className="font-medium text-foreground">Fechado</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Pizzaria</h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex justify-between">
                    <span>Terça a Quinta</span>
                    <span className="font-medium text-foreground">18h às 23h</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sexta a Domingo</span>
                    <span className="font-medium text-foreground">18h às 00h</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Segunda</span>
                    <span className="font-medium text-foreground">Fechado</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

