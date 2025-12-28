import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pizza, Utensils, Wine, IceCream } from "lucide-react";

const pizzasTradiconais = [
  { name: "Margherita", description: "Molho de tomate, mussarela, manjericão fresco e azeite", price: "R$ 45,00" },
  { name: "Calabresa", description: "Molho de tomate, mussarela, calabresa fatiada e cebola", price: "R$ 48,00" },
  { name: "Portuguesa", description: "Molho de tomate, mussarela, presunto, ovos, cebola, azeitonas e ervilha", price: "R$ 52,00" },
  { name: "Quatro Queijos", description: "Molho de tomate, mussarela, provolone, gorgonzola e parmesão", price: "R$ 55,00" },
  { name: "Frango com Catupiry", description: "Molho de tomate, mussarela, frango desfiado e catupiry", price: "R$ 52,00" },
  { name: "Pepperoni", description: "Molho de tomate, mussarela e pepperoni artesanal", price: "R$ 56,00" },
];

const pizzasEspeciais = [
  { name: "Pirata Especial", description: "Molho de tomate, mussarela, camarão, lula, mexilhões e molho de alho", price: "R$ 75,00", destaque: true },
  { name: "Tesouro do Mar", description: "Molho branco, mussarela, salmão defumado, cream cheese e alcaparras", price: "R$ 78,00" },
  { name: "Capitão Jack", description: "Molho de tomate, mussarela, bacon, cogumelos e cebola caramelizada", price: "R$ 62,00" },
  { name: "Ilha do Sabor", description: "Molho de tomate, mussarela de búfala, tomate seco e rúcula", price: "R$ 65,00" },
];

const pratosAlmoco = [
  { name: "Filé à Parmegiana", description: "Filé empanado coberto com molho e queijo, arroz, fritas e salada", price: "R$ 38,00" },
  { name: "Picanha Grelhada", description: "Picanha grelhada com arroz, feijão tropeiro e vinagrete", price: "R$ 45,00" },
  { name: "Frango Grelhado", description: "Peito de frango grelhado com legumes, arroz e salada", price: "R$ 32,00" },
  { name: "Prato Executivo", description: "Opção do dia com arroz, feijão, proteína e salada", price: "R$ 25,00" },
  { name: "Lasanha Bolonhesa", description: "Lasanha artesanal com molho bolonhesa e queijo gratinado", price: "R$ 35,00" },
];

const bebidas = [
  { name: "Refrigerante Lata", price: "R$ 6,00" },
  { name: "Refrigerante 2L", price: "R$ 12,00" },
  { name: "Suco Natural", price: "R$ 8,00" },
  { name: "Água Mineral", price: "R$ 4,00" },
  { name: "Cerveja Long Neck", price: "R$ 10,00" },
  { name: "Vinho da Casa (Taça)", price: "R$ 18,00" },
];

const sobremesas = [
  { name: "Petit Gateau", description: "Bolinho de chocolate com sorvete de creme", price: "R$ 22,00" },
  { name: "Pudim", description: "Pudim de leite condensado tradicional", price: "R$ 12,00" },
  { name: "Açaí 300ml", description: "Açaí com granola, banana e mel", price: "R$ 18,00" },
];

export default function CardapioPage() {
  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Nosso Cardápio
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Descubra Nossos Sabores
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            De pizzas artesanais a pratos executivos, preparamos tudo com ingredientes
            frescos e muito carinho para você.
          </p>
        </div>
      </section>

      {/* Menu Tabs */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="pizzas" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="pizzas" className="gap-2">
              <Pizza className="h-4 w-4" />
              <span className="hidden sm:inline">Pizzas</span>
            </TabsTrigger>
            <TabsTrigger value="almoco" className="gap-2">
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Almoço</span>
            </TabsTrigger>
            <TabsTrigger value="bebidas" className="gap-2">
              <Wine className="h-4 w-4" />
              <span className="hidden sm:inline">Bebidas</span>
            </TabsTrigger>
            <TabsTrigger value="sobremesas" className="gap-2">
              <IceCream className="h-4 w-4" />
              <span className="hidden sm:inline">Sobremesas</span>
            </TabsTrigger>
          </TabsList>

          {/* Pizzas */}
          <TabsContent value="pizzas" className="space-y-12">
            {/* Tradicionais */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Pizza className="h-6 w-6 text-primary" />
                Pizzas Tradicionais
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pizzasTradiconais.map((pizza) => (
                  <Card key={pizza.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{pizza.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{pizza.description}</p>
                      </div>
                      <span className="font-semibold text-primary ml-4 whitespace-nowrap">
                        {pizza.price}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Especiais */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Pizza className="h-6 w-6 text-primary" />
                Pizzas Especiais
                <Badge variant="secondary">Premium</Badge>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pizzasEspeciais.map((pizza) => (
                  <Card 
                    key={pizza.name} 
                    className={`hover:shadow-md transition-shadow ${pizza.destaque ? 'border-primary/50 bg-primary/5' : ''}`}
                  >
                    <CardContent className="p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{pizza.name}</h3>
                          {pizza.destaque && (
                            <Badge className="text-xs">Destaque</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{pizza.description}</p>
                      </div>
                      <span className="font-semibold text-primary ml-4 whitespace-nowrap">
                        {pizza.price}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              * Todas as pizzas são tamanho grande (8 fatias). Bordas recheadas: +R$ 8,00
            </p>
          </TabsContent>

          {/* Almoço */}
          <TabsContent value="almoco">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary" />
              Pratos Executivos
              <Badge variant="outline">Seg a Sex • 11h às 15h</Badge>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {pratosAlmoco.map((prato) => (
                <Card key={prato.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{prato.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{prato.description}</p>
                    </div>
                    <span className="font-semibold text-primary ml-4 whitespace-nowrap">
                      {prato.price}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bebidas */}
          <TabsContent value="bebidas">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Wine className="h-6 w-6 text-primary" />
              Bebidas
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
              {bebidas.map((bebida) => (
                <Card key={bebida.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex justify-between items-center">
                    <span className="font-medium">{bebida.name}</span>
                    <span className="font-semibold text-primary">{bebida.price}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sobremesas */}
          <TabsContent value="sobremesas">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <IceCream className="h-6 w-6 text-primary" />
              Sobremesas
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
              {sobremesas.map((sobremesa) => (
                <Card key={sobremesa.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{sobremesa.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{sobremesa.description}</p>
                    </div>
                    <span className="font-semibold text-primary ml-4 whitespace-nowrap">
                      {sobremesa.price}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

