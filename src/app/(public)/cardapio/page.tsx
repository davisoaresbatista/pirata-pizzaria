"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pizza, Utensils, Wine, IceCream, Cake, AlertCircle, Search, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";

const pizzasSalgadas = [
  { name: "A Moda", description: "Frango, champignon, palmito e requeijão", price: 69.99 },
  { name: "Alho e Óleo", description: "Mussarela, alho frito e parmesão", price: 64.99 },
  { name: "Aliche", description: "Aliche, mussarela e rodelas de tomate", price: 69.99 },
  { name: "Atum", description: "Atum e cebola", price: 64.99 },
  { name: "Bacon", description: "Mussarela e bacon", price: 64.99 },
  { name: "Baiana", description: "Calabresa, cebola, pimenta e mussarela", price: 69.99, picante: true },
  { name: "Bauru", description: "Presunto, mussarela e tomate", price: 64.99 },
  { name: "Bertioga", description: "Ervilha, atum, palmito e mussarela", price: 69.99, destaque: true },
  { name: "Brócolis", description: "Requeijão cremoso, brócolis e bacon", price: 69.99 },
  { name: "Caiçara", description: "Frango desfiado, ervilha, palmito e mussarela", price: 69.99 },
  { name: "Caipira", description: "Frango, milho, bacon e mussarela", price: 69.99 },
  { name: "Calabresa", description: "Calabresa e cebola", price: 39.99, popular: true },
  { name: "Calzone Aberto", description: "Presunto, mussarela, requeijão cremoso e parmesão", price: 69.99 },
  { name: "Caribe", description: "Mussarela, bacon, palmito, alface americano e alho frito", price: 69.99 },
  { name: "Champignon", description: "Champignon e mussarela", price: 64.99 },
  { name: "Caruara", description: "Calabresa, bacon, milho e mussarela", price: 69.99 },
  { name: "Di Mori", description: "Mussarela, requeijão, palmito, alho frito e rodelas de tomate", price: 69.99 },
  { name: "Escarola", description: "Escarola e mussarela", price: 64.99 },
  { name: "Frango", description: "Frango e requeijão cremoso", price: 69.99 },
  { name: "Galeão", description: "Calabresa, palmito, milho e mussarela", price: 69.99 },
  { name: "Lombinho", description: "Lombo canadense e requeijão cremoso", price: 69.99 },
  { name: "Marguerita", description: "Mussarela, parmesão, manjericão e tomate", price: 64.99, popular: true },
  { name: "Milanesa", description: "Calabresa e requeijão cremoso", price: 69.99 },
  { name: "Peperone", description: "Peperone e mussarela", price: 69.99 },
  { name: "Milho Verde", description: "Milho verde e mussarela", price: 64.99 },
  { name: "Mussarela", description: "Mussarela", price: 54.99, popular: true },
  { name: "Napolitana", description: "Mussarela, alho, parmesão e rodela de tomate", price: 64.99 },
  { name: "Palmito", description: "Palmito e mussarela", price: 64.99 },
  { name: "Palmito Especial", description: "Palmito, requeijão cremoso e tomate seco", price: 69.99 },
  { name: "Pirata", description: "Frango, palmito, requeijão cremoso e tomate", price: 69.99, destaque: true },
  { name: "Pizzaiolo", description: "Provolone, presunto, bacon e tomate", price: 69.99 },
  { name: "Portuguesa", description: "Presunto, ovos, cebola, palmito, ervilha e mussarela", price: 69.99, popular: true },
  { name: "Porto", description: "Lombo canadense, cebola e mussarela", price: 69.99 },
  { name: "Praiana", description: "Mussarela, atum e cebola", price: 69.99 },
  { name: "2 Queijos", description: "Requeijão cremoso e mussarela", price: 64.99 },
  { name: "3 Queijos", description: "Requeijão cremoso, mussarela e parmesão", price: 69.99 },
  { name: "4 Queijos", description: "Requeijão, mussarela, parmesão e provolone", price: 69.99, popular: true },
  { name: "5 Queijos", description: "Requeijão, mussarela, parmesão, provolone e cheddar", price: 69.99 },
  { name: "Rúcula", description: "Rúcula, mussarela e tomate seco", price: 69.99 },
  { name: "Siciliana", description: "Champignon, bacon e mussarela", price: 69.99 },
  { name: "Suprema", description: "Bacon, champignon, requeijão cremoso e tomate seco", price: 69.99 },
  { name: "Tomate Seco", description: "Tomate seco, mussarela e parmesão", price: 69.99 },
  { name: "Toscana", description: "Calabresa, mussarela e cebola", price: 69.99 },
  { name: "Vegetariana", description: "Escarola, palmito, tomate, ervilha e cebola", price: 69.99 },
];

const pizzasDoces = [
  { name: "Brigadeiro", description: "Chocolate ao leite e granulado", price: 69.99, popular: true },
  { name: "Confete", description: "Chocolate ao leite e confete", price: 69.99 },
  { name: "Chocobanana", description: "Chocolate ao leite e banana", price: 69.99 },
  { name: "Prestígio", description: "Chocolate ao leite e coco ralado", price: 69.99 },
  { name: "Sensação", description: "Chocolate ao leite e morango", price: 69.99, popular: true },
  { name: "Romeu e Julieta", description: "Mussarela e goiabada", price: 69.99 },
  { name: "Chita", description: "Banana, canela, leite condensado e cereja", price: 69.99 },
];

const pratosAlmoco = [
  { name: "Filé à Parmegiana", description: "Filé empanado coberto com molho e queijo, arroz, fritas e salada", price: 38.00 },
  { name: "Picanha Grelhada", description: "Picanha grelhada com arroz, feijão tropeiro e vinagrete", price: 45.00 },
  { name: "Frango Grelhado", description: "Peito de frango grelhado com legumes, arroz e salada", price: 32.00 },
  { name: "Prato Executivo", description: "Opção do dia com arroz, feijão, proteína e salada", price: 25.00 },
  { name: "Lasanha Bolonhesa", description: "Lasanha artesanal com molho bolonhesa e queijo gratinado", price: 35.00 },
];

const bebidas = [
  { name: "Refrigerante Lata", price: 6.00 },
  { name: "Refrigerante 2L", price: 12.00 },
  { name: "Suco Natural", price: 8.00 },
  { name: "Água Mineral", price: 4.00 },
  { name: "Cerveja Long Neck", price: 10.00 },
  { name: "Vinho da Casa (Taça)", price: 18.00 },
];

const sobremesas = [
  { name: "Petit Gateau", description: "Bolinho de chocolate com sorvete de creme", price: 22.00 },
  { name: "Pudim", description: "Pudim de leite condensado tradicional", price: 12.00 },
  { name: "Açaí 300ml", description: "Açaí com granola, banana e mel", price: 18.00 },
];

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

export default function CardapioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPizzasSalgadas = pizzasSalgadas.filter(pizza => 
    pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pizza.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPizzasDoces = pizzasDoces.filter(pizza => 
    pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pizza.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&q=80"
            alt="Pizza artesanal"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <Badge className="bg-primary/90 text-white mb-4 text-sm px-4 py-1">
            🍕 Cardápio Completo
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            Nossos Sabores
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
            Mais de 50 sabores artesanais preparados com ingredientes selecionados
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar pizza por nome ou ingrediente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg bg-white/95 text-foreground border-0 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Aviso Preços */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 shadow-xl flex items-center gap-4 max-w-3xl mx-auto">
          <div className="bg-white/20 rounded-full p-3">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <div className="text-white">
            <p className="font-bold text-lg">Preços exclusivos para o salão</p>
            <p className="text-white/90">Os valores abaixo são praticados somente para consumo no estabelecimento.</p>
          </div>
        </div>
      </section>

      {/* Menu Tabs */}
      <section className="container mx-auto px-4 py-16">
        <Tabs defaultValue="pizzas" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-12 h-16 p-2 bg-secondary/50">
            <TabsTrigger value="pizzas" className="gap-2 h-12 text-base data-[state=active]:bg-primary data-[state=active]:text-white">
              <Pizza className="h-5 w-5" />
              <span className="hidden sm:inline">Pizzas</span>
            </TabsTrigger>
            <TabsTrigger value="almoco" className="gap-2 h-12 text-base data-[state=active]:bg-primary data-[state=active]:text-white">
              <Utensils className="h-5 w-5" />
              <span className="hidden sm:inline">Almoço</span>
            </TabsTrigger>
            <TabsTrigger value="bebidas" className="gap-2 h-12 text-base data-[state=active]:bg-primary data-[state=active]:text-white">
              <Wine className="h-5 w-5" />
              <span className="hidden sm:inline">Bebidas</span>
            </TabsTrigger>
            <TabsTrigger value="sobremesas" className="gap-2 h-12 text-base data-[state=active]:bg-primary data-[state=active]:text-white">
              <IceCream className="h-5 w-5" />
              <span className="hidden sm:inline">Sobremesas</span>
            </TabsTrigger>
          </TabsList>

          {/* Pizzas */}
          <TabsContent value="pizzas" className="space-y-16">
            {/* Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative h-48 rounded-2xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80"
                  alt="Pizza Marguerita"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold">Marguerita</span>
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
                  alt="Pizza 4 Queijos"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold">4 Queijos</span>
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80"
                  alt="Pizza Calabresa"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold">Calabresa</span>
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80"
                  alt="Pizza Portuguesa"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold">Portuguesa</span>
              </div>
            </div>

            {/* Pizzas Salgadas */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Pizza className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Pizzas Salgadas</h2>
                    <p className="text-muted-foreground">{filteredPizzasSalgadas.length} sabores disponíveis</p>
                  </div>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPizzasSalgadas.map((pizza) => (
                  <Card 
                    key={pizza.name} 
                    className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                      pizza.destaque ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">{pizza.name}</h3>
                            {pizza.destaque && (
                              <Badge className="bg-primary text-white">⭐ Destaque</Badge>
                            )}
                            {pizza.popular && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">🔥 Popular</Badge>
                            )}
                            {pizza.picante && (
                              <Badge variant="secondary" className="bg-red-100 text-red-700">
                                <Flame className="h-3 w-3 mr-1" /> Picante
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{pizza.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(pizza.price)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pizzas Doces */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-pink-100 rounded-full p-3">
                  <Cake className="h-8 w-8 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Pizzas Doces</h2>
                  <p className="text-muted-foreground">{filteredPizzasDoces.length} sabores deliciosos</p>
                </div>
              </div>

              {/* Doces Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80"
                    alt="Pizza de Chocolate"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-bold">Brigadeiro</span>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80"
                    alt="Pizza com Morango"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-bold">Sensação</span>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
                    alt="Pizza de Banana"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-bold">Chocobanana</span>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"
                    alt="Pizza com Coco"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-bold">Prestígio</span>
                </div>
              </div>
              
              {/* Banner Doces */}
              <div className="relative h-32 rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold">🍫 Finalize com Doçura! 🍓</h3>
                    <p className="text-white/90 text-sm md:text-base">Pizzas doces irresistíveis, perfeitas para compartilhar</p>
                  </div>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPizzasDoces.map((pizza) => (
                  <Card 
                    key={pizza.name} 
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200/50"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{pizza.name}</h3>
                        {pizza.popular && (
                          <Badge className="bg-pink-500 text-white">❤️ Favorita</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{pizza.description}</p>
                      <span className="text-2xl font-bold text-pink-600">
                        {formatPrice(pizza.price)}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <p className="text-center text-muted-foreground bg-secondary/30 rounded-full py-3 px-6 max-w-xl mx-auto">
              🍕 Todas as pizzas são tamanho grande (8 fatias) • Preços válidos para consumo no salão
            </p>
          </TabsContent>

          {/* Almoço */}
          <TabsContent value="almoco" className="space-y-8">
            <div className="relative h-64 rounded-3xl overflow-hidden mb-8">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80"
                alt="Pratos do Almoço"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/80 to-orange-600/80" />
              <div className="absolute inset-0 flex items-center p-8">
                <div className="text-white">
                  <Badge className="bg-white/20 text-white mb-4">Terça a Domingo • 11h às 15h</Badge>
                  <h2 className="text-4xl font-bold mb-2">Pratos Executivos</h2>
                  <p className="text-white/90 max-w-xl">Almoço caprichado com ingredientes frescos e sabor caseiro</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pratosAlmoco.map((prato) => (
                <Card key={prato.name} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">{prato.name}</h3>
                      <p className="text-muted-foreground">{prato.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary ml-4 whitespace-nowrap">
                      {formatPrice(prato.price)}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="text-amber-800">
                <strong>⚠️ Atenção:</strong> Almoço não funciona às segundas-feiras.
              </p>
            </div>
          </TabsContent>

          {/* Bebidas */}
          <TabsContent value="bebidas" className="space-y-8">
            <div className="relative h-48 rounded-3xl overflow-hidden mb-8">
              <Image
                src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1200&q=80"
                alt="Bebidas"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/80 to-blue-600/80" />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Wine className="h-12 w-12 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold">Bebidas</h2>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {bebidas.map((bebida) => (
                <Card key={bebida.name} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 flex justify-between items-center">
                    <span className="font-semibold text-lg">{bebida.name}</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(bebida.price)}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sobremesas */}
          <TabsContent value="sobremesas" className="space-y-8">
            <div className="relative h-48 rounded-3xl overflow-hidden mb-8">
              <Image
                src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80"
                alt="Sobremesas"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-pink-600/80" />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <IceCream className="h-12 w-12 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold">Sobremesas</h2>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {sobremesas.map((sobremesa) => (
                <Card key={sobremesa.name} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-2">{sobremesa.name}</h3>
                    <p className="text-muted-foreground mb-4">{sobremesa.description}</p>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatPrice(sobremesa.price)}
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
