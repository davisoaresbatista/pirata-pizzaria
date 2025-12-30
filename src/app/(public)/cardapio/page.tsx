import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pizza, Utensils, Wine, IceCream, Cake, AlertCircle } from "lucide-react";

const pizzasSalgadas = [
  { name: "A Moda", description: "Frango, champignon, palmito e requeijão", price: "R$ 69,99" },
  { name: "Alho e Óleo", description: "Mussarela, alho frito e parmesão", price: "R$ 64,99" },
  { name: "Aliche", description: "Aliche, mussarela e rodelas de tomate", price: "R$ 69,99" },
  { name: "Atum", description: "Atum e cebola", price: "R$ 64,99" },
  { name: "Bacon", description: "Mussarela e bacon", price: "R$ 64,99" },
  { name: "Baiana", description: "Calabresa, cebola, pimenta e mussarela", price: "R$ 69,99" },
  { name: "Bauru", description: "Presunto, mussarela e tomate", price: "R$ 64,99" },
  { name: "Bertioga", description: "Ervilha, atum, palmito e mussarela", price: "R$ 69,99", destaque: true },
  { name: "Brócolis", description: "Requeijão cremoso, brócolis e bacon", price: "R$ 69,99" },
  { name: "Caiçara", description: "Frango desfiado, ervilha, palmito e mussarela", price: "R$ 69,99" },
  { name: "Caipira", description: "Frango, milho, bacon e mussarela", price: "R$ 69,99" },
  { name: "Calabresa", description: "Calabresa e cebola", price: "R$ 39,99" },
  { name: "Calzone Aberto", description: "Presunto, mussarela, requeijão cremoso e parmesão", price: "R$ 69,99" },
  { name: "Caribe", description: "Mussarela, bacon, palmito, alface americano e alho frito", price: "R$ 69,99" },
  { name: "Champignon", description: "Champignon e mussarela", price: "R$ 64,99" },
  { name: "Caruara", description: "Calabresa, bacon, milho e mussarela", price: "R$ 69,99" },
  { name: "Di Mori", description: "Mussarela, requeijão, palmito, alho frito e rodelas de tomate", price: "R$ 69,99" },
  { name: "Escarola", description: "Escarola e mussarela", price: "R$ 64,99" },
  { name: "Frango", description: "Frango e requeijão cremoso", price: "R$ 69,99" },
  { name: "Galeão", description: "Calabresa, palmito, milho e mussarela", price: "R$ 69,99" },
  { name: "Lombinho", description: "Lombo canadense e requeijão cremoso", price: "R$ 69,99" },
  { name: "Marguerita", description: "Mussarela, parmesão, manjericão e tomate", price: "R$ 64,99" },
  { name: "Milanesa", description: "Calabresa e requeijão cremoso", price: "R$ 69,99" },
  { name: "Peperone", description: "Peperone e mussarela", price: "R$ 69,99" },
  { name: "Milho Verde", description: "Milho verde e mussarela", price: "R$ 64,99" },
  { name: "Mussarela", description: "Mussarela", price: "R$ 54,99" },
  { name: "Napolitana", description: "Mussarela, alho, parmesão e rodela de tomate", price: "R$ 64,99" },
  { name: "Palmito", description: "Palmito e mussarela", price: "R$ 64,99" },
  { name: "Palmito Especial", description: "Palmito, requeijão cremoso e tomate seco", price: "R$ 69,99" },
  { name: "Pirata", description: "Frango, palmito, requeijão cremoso e tomate", price: "R$ 69,99", destaque: true },
  { name: "Pizzaiolo", description: "Provolone, presunto, bacon e tomate", price: "R$ 69,99" },
  { name: "Portuguesa", description: "Presunto, ovos, cebola, palmito, ervilha e mussarela", price: "R$ 69,99" },
  { name: "Porto", description: "Lombo canadense, cebola e mussarela", price: "R$ 69,99" },
  { name: "Praiana", description: "Mussarela, atum e cebola", price: "R$ 69,99" },
  { name: "2 Queijos", description: "Requeijão cremoso e mussarela", price: "R$ 64,99" },
  { name: "3 Queijos", description: "Requeijão cremoso, mussarela e parmesão", price: "R$ 69,99" },
  { name: "4 Queijos", description: "Requeijão, mussarela, parmesão e provolone", price: "R$ 69,99" },
  { name: "5 Queijos", description: "Requeijão, mussarela, parmesão, provolone e cheddar", price: "R$ 69,99" },
  { name: "Rúcula", description: "Rúcula, mussarela e tomate seco", price: "R$ 69,99" },
  { name: "Siciliana", description: "Champignon, bacon e mussarela", price: "R$ 69,99" },
  { name: "Suprema", description: "Bacon, champignon, requeijão cremoso e tomate seco", price: "R$ 69,99" },
  { name: "Tomate Seco", description: "Tomate seco, mussarela e parmesão", price: "R$ 69,99" },
  { name: "Toscana", description: "Calabresa, mussarela e cebola", price: "R$ 69,99" },
  { name: "Vegetariana", description: "Escarola, palmito, tomate, ervilha e cebola", price: "R$ 69,99" },
];

const pizzasDoces = [
  { name: "Brigadeiro", description: "Chocolate ao leite e granulado", price: "R$ 69,99" },
  { name: "Confete", description: "Chocolate ao leite e confete", price: "R$ 69,99" },
  { name: "Chocobanana", description: "Chocolate ao leite e banana", price: "R$ 69,99" },
  { name: "Prestígio", description: "Chocolate ao leite e coco ralado", price: "R$ 69,99" },
  { name: "Sensação", description: "Chocolate ao leite e morango", price: "R$ 69,99" },
  { name: "Romeu e Julieta", description: "Mussarela e goiabada", price: "R$ 69,99" },
  { name: "Chita", description: "Banana, canela, leite condensado e cereja", price: "R$ 69,99" },
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
            {/* Aviso Preços Salão */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 max-w-2xl mx-auto">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Atenção:</strong> Os preços abaixo são praticados exclusivamente para consumo no salão.
                Para delivery, consulte nossos canais de atendimento.
              </p>
            </div>

            {/* Pizzas Salgadas */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Pizza className="h-6 w-6 text-primary" />
                Pizzas Salgadas
                <Badge variant="secondary">{pizzasSalgadas.length} sabores</Badge>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pizzasSalgadas.map((pizza) => (
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

            {/* Pizzas Doces */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Cake className="h-6 w-6 text-primary" />
                Pizzas Doces
                <Badge variant="secondary">{pizzasDoces.length} sabores</Badge>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pizzasDoces.map((pizza) => (
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

            <p className="text-center text-sm text-muted-foreground">
              * Todas as pizzas são tamanho grande (8 fatias). Preços válidos para consumo no salão.
            </p>
          </TabsContent>

          {/* Almoço */}
          <TabsContent value="almoco">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary" />
              Pratos Executivos
              <Badge variant="outline">Ter a Dom • 11h às 15h</Badge>
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
            <p className="text-center text-sm text-muted-foreground mt-6">
              * Almoço não funciona às segundas-feiras.
            </p>
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
