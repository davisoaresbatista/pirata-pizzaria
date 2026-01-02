"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Utensils, Wine, Search, Flame, Star, Leaf, Sparkles,
  Fish, Drumstick, Beef, Soup, UtensilsCrossed, GlassWater, Salad,
  Pizza, Cake, IceCream, Sun, Moon, Clock, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  featured: boolean;
  popular: boolean;
  spicy: boolean;
  vegetarian: boolean;
  newItem: boolean;
  imageUrl?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  shift: "lunch" | "dinner" | "both";
  items: MenuItem[];
}

// Mapa de ícones
const iconMap: Record<string, React.ReactNode> = {
  Salad: <Salad className="h-6 w-6" />,
  Fish: <Fish className="h-6 w-6" />,
  Beef: <Beef className="h-6 w-6" />,
  Drumstick: <Drumstick className="h-6 w-6" />,
  Soup: <Soup className="h-6 w-6" />,
  UtensilsCrossed: <UtensilsCrossed className="h-6 w-6" />,
  Utensils: <Utensils className="h-6 w-6" />,
  Wine: <Wine className="h-6 w-6" />,
  GlassWater: <GlassWater className="h-6 w-6" />,
  Pizza: <Pizza className="h-6 w-6" />,
  Cake: <Cake className="h-6 w-6" />,
  IceCream: <IceCream className="h-6 w-6" />,
};

// Imagens por categoria
const categoryImages: Record<string, string> = {
  pizzas_salgadas: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  pizzas_doces: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80",
  bebidas: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
  sobremesas: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  entradas: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80",
  peixes: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
  carnes: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  frango: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
  massas: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
  porcoes: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80",
};

function formatPrice(price: number) {
  return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
}

export default function CardapioPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeShift, setActiveShift] = useState<"lunch" | "dinner" | "both">("dinner");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/menu/public");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  // Filtrar itens baseado na busca
  const filterItems = (items: MenuItem[]) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Organizar categorias por turno
  const lunchCategories = categories.filter(c => c.shift === "lunch");
  const dinnerCategories = categories.filter(c => c.shift === "dinner");
  const bothCategories = categories.filter(c => c.shift === "both");

  // Categorias visíveis baseado no turno selecionado
  const getVisibleCategories = () => {
    if (activeShift === "lunch") {
      return [...lunchCategories, ...bothCategories];
    } else if (activeShift === "dinner") {
      return [...dinnerCategories, ...bothCategories];
    }
    return categories;
  };

  const visibleCategories = getVisibleCategories();

  // Contagem de itens por turno
  const lunchItems = [...lunchCategories, ...bothCategories].reduce((acc, cat) => acc + cat.items.length, 0);
  const dinnerItems = [...dinnerCategories, ...bothCategories].reduce((acc, cat) => acc + cat.items.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Compacto */}
      <section className="relative bg-[#0a0a0a] py-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-red-700/15 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Nosso <span className="text-red-500">Cardápio</span>
            </h1>
            <p className="text-white/60">
              Escolha o turno para ver o cardápio completo
            </p>
          </div>
        </div>
      </section>

      {/* SELETOR DE TURNO - DESTAQUE PRINCIPAL */}
      <section className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Card Almoço */}
          <button
            onClick={() => setActiveShift("lunch")}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] ${
              activeShift === "lunch"
                ? "bg-white shadow-2xl ring-2 ring-neutral-900"
                : "bg-white/80 shadow-lg hover:shadow-xl hover:bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl p-4 transition-colors ${
                activeShift === "lunch" 
                  ? "bg-neutral-900 text-white" 
                  : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
              }`}>
                <Sun className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-xl font-bold transition-colors ${
                    activeShift === "lunch" ? "text-neutral-900" : "text-neutral-700"
                  }`}>
                    Restaurante
                  </h2>
                  {activeShift === "lunch" && (
                    <Badge className="bg-neutral-900 text-white text-xs">Ativo</Badge>
                  )}
                </div>
                <p className="text-neutral-500 text-sm mb-3">Almoço executivo e pratos variados</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-neutral-500">
                    <Clock className="h-4 w-4" />
                    Seg a Sex • 11h-15h
                  </span>
                  <Badge variant="outline" className="text-neutral-600 border-neutral-300">
                    {lunchItems} itens
                  </Badge>
                </div>
              </div>
              <ChevronRight className={`h-6 w-6 transition-all ${
                activeShift === "lunch" 
                  ? "text-neutral-900 translate-x-0" 
                  : "text-neutral-300 -translate-x-1 group-hover:translate-x-0 group-hover:text-neutral-500"
              }`} />
            </div>
            {activeShift === "lunch" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900" />
            )}
          </button>

          {/* Card Pizzaria */}
          <button
            onClick={() => setActiveShift("dinner")}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] ${
              activeShift === "dinner"
                ? "bg-red-600 shadow-2xl shadow-red-200"
                : "bg-white/80 shadow-lg hover:shadow-xl hover:bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl p-4 transition-colors ${
                activeShift === "dinner" 
                  ? "bg-white/20 text-white" 
                  : "bg-red-50 text-red-500 group-hover:bg-red-100"
              }`}>
                <Pizza className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-xl font-bold transition-colors ${
                    activeShift === "dinner" ? "text-white" : "text-neutral-700"
                  }`}>
                    Pizzaria
                  </h2>
                  {activeShift === "dinner" && (
                    <Badge className="bg-white/20 text-white text-xs border-0">Ativo</Badge>
                  )}
                </div>
                <p className={`text-sm mb-3 ${activeShift === "dinner" ? "text-white/80" : "text-neutral-500"}`}>
                  Pizzas artesanais e delícias
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className={`flex items-center gap-1 ${activeShift === "dinner" ? "text-white/70" : "text-neutral-500"}`}>
                    <Moon className="h-4 w-4" />
                    Ter a Dom • 18h-23h
                  </span>
                  <Badge 
                    variant="outline" 
                    className={activeShift === "dinner" 
                      ? "text-white border-white/30" 
                      : "text-neutral-600 border-neutral-300"
                    }
                  >
                    {dinnerItems} itens
                  </Badge>
                </div>
              </div>
              <ChevronRight className={`h-6 w-6 transition-all ${
                activeShift === "dinner" 
                  ? "text-white translate-x-0" 
                  : "text-neutral-300 -translate-x-1 group-hover:translate-x-0 group-hover:text-neutral-500"
              }`} />
            </div>
            {activeShift === "dinner" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />
            )}
          </button>
        </div>
      </section>

      {/* Barra de Busca */}
      <section className="container mx-auto px-4 py-6">
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Buscar por nome ou ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-base bg-white border-neutral-200 shadow-sm"
          />
        </div>
      </section>

      {/* Categorias do Turno */}
      <section className="container mx-auto px-4 pb-12">
        {visibleCategories.length > 0 ? (
          <div className="space-y-12">
            {/* Categorias principais do turno */}
            {(activeShift === "lunch" ? lunchCategories : dinnerCategories).map(category => {
              const filteredItems = filterItems(category.items);
              const categoryImage = categoryImages[category.name];
              
              if (filteredItems.length === 0 && searchTerm) return null;
              
              return (
                <div key={category.id} id={category.name}>
                  {/* Header da categoria com imagem */}
                  <div className="relative rounded-2xl overflow-hidden mb-6">
                    {categoryImage && (
                      <div className="absolute inset-0">
                        <img 
                          src={categoryImage} 
                          alt={category.displayName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                      </div>
                    )}
                    {!categoryImage && (
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-800" />
                    )}
                    
                    <div className="relative p-6 md:p-8">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-red-600 p-3 text-white shadow-lg">
                          {iconMap[category.icon || "Utensils"] || <Utensils className="h-6 w-6" />}
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white">{category.displayName}</h2>
                          {category.description && (
                            <p className="text-white/70 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid de itens */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <Card 
                        key={item.id} 
                        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-neutral-200 bg-white"
                      >
                        <CardContent className="p-5">
                          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[24px]">
                            {item.featured && (
                              <Badge className="bg-red-600 text-white text-xs border-0">
                                <Star className="h-3 w-3 mr-1" /> Destaque
                              </Badge>
                            )}
                            {item.popular && (
                              <Badge className="bg-neutral-900 text-white text-xs">
                                <Flame className="h-3 w-3 mr-1" /> Popular
                              </Badge>
                            )}
                            {item.spicy && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                🌶️ Picante
                              </Badge>
                            )}
                            {item.vegetarian && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <Leaf className="h-3 w-3 mr-1" /> Veg
                              </Badge>
                            )}
                            {item.newItem && (
                              <Badge className="bg-neutral-100 text-neutral-700 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" /> Novo
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-bold text-lg mb-2 text-neutral-900 group-hover:text-red-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-neutral-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                            {item.description || "—"}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                            <span className="text-xl font-bold text-red-600">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Separador para seções comuns */}
            {bothCategories.length > 0 && (
              <div className="border-t border-neutral-200 pt-12">
                <div className="text-center mb-8">
                  <Badge className="bg-neutral-200 text-neutral-700 px-4 py-2 text-sm">
                    🥤 Disponível em ambos os turnos
                  </Badge>
                </div>

                {bothCategories.map(category => {
                  const filteredItems = filterItems(category.items);
                  const categoryImage = categoryImages[category.name];
                  
                  if (filteredItems.length === 0 && searchTerm) return null;
                  
                  return (
                    <div key={category.id} id={category.name} className="mb-12">
                      {/* Header da categoria */}
                      <div className="relative rounded-2xl overflow-hidden mb-6">
                        {categoryImage && (
                          <div className="absolute inset-0">
                            <img 
                              src={categoryImage} 
                              alt={category.displayName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                          </div>
                        )}
                        {!categoryImage && (
                          <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-700" />
                        )}
                        
                        <div className="relative p-6">
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-neutral-700 p-3 text-white shadow-lg">
                              {iconMap[category.icon || "Utensils"] || <Utensils className="h-6 w-6" />}
                            </div>
                            <div>
                              <h2 className="text-xl md:text-2xl font-bold text-white">{category.displayName}</h2>
                              {category.description && (
                                <p className="text-white/70 text-sm mt-1">{category.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Grid de itens */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {filteredItems.map((item) => (
                          <Card 
                            key={item.id} 
                            className="group hover:shadow-lg transition-all border border-neutral-200 bg-white"
                          >
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-neutral-900 group-hover:text-red-600 transition-colors mb-1">
                                {item.name}
                              </h3>
                              <p className="text-neutral-500 text-xs mb-2 line-clamp-1">
                                {item.description || "—"}
                              </p>
                              <span className="text-lg font-bold text-red-600">
                                {formatPrice(item.price)}
                              </span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <Utensils className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-neutral-900">Cardápio em atualização</h2>
            <p className="text-neutral-500">Nosso cardápio está sendo preparado. Volte em breve!</p>
          </div>
        )}
      </section>

      {/* Rodapé */}
      <section className="container mx-auto px-4 pb-12">
        <div className="text-center">
          <p className="text-neutral-500 bg-white rounded-full py-3 px-6 inline-block text-sm shadow-sm">
            🍽️ Todos os pratos são preparados na hora • Preços válidos para consumo no salão
          </p>
        </div>
      </section>
    </div>
  );
}
