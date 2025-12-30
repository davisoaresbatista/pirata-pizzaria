"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Utensils, Wine, Search, Flame, Star, Leaf, Sparkles,
  Fish, Drumstick, Beef, Soup, UtensilsCrossed, GlassWater, Salad
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
  items: MenuItem[];
}

// Mapa de ícones
const iconMap: Record<string, React.ReactNode> = {
  Salad: <Salad className="h-5 w-5" />,
  Fish: <Fish className="h-5 w-5" />,
  Beef: <Beef className="h-5 w-5" />,
  Drumstick: <Drumstick className="h-5 w-5" />,
  Soup: <Soup className="h-5 w-5" />,
  UtensilsCrossed: <UtensilsCrossed className="h-5 w-5" />,
  Utensils: <Utensils className="h-5 w-5" />,
  Wine: <Wine className="h-5 w-5" />,
  GlassWater: <GlassWater className="h-5 w-5" />,
};

const iconMapLarge: Record<string, React.ReactNode> = {
  Salad: <Salad className="h-8 w-8" />,
  Fish: <Fish className="h-8 w-8" />,
  Beef: <Beef className="h-8 w-8" />,
  Drumstick: <Drumstick className="h-8 w-8" />,
  Soup: <Soup className="h-8 w-8" />,
  UtensilsCrossed: <UtensilsCrossed className="h-8 w-8" />,
  Utensils: <Utensils className="h-8 w-8" />,
  Wine: <Wine className="h-8 w-8" />,
  GlassWater: <GlassWater className="h-8 w-8" />,
};

function formatPrice(price: number) {
  return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
}

// Cores por tipo de categoria
const categoryColors: Record<string, { bg: string; text: string; accent: string }> = {
  entradas: { bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-100" },
  peixes_individual: { bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-100" },
  peixes_duplo: { bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-100" },
  carnes_individual: { bg: "bg-red-50", text: "text-red-700", accent: "bg-red-100" },
  carnes_duplo: { bg: "bg-red-50", text: "text-red-700", accent: "bg-red-100" },
  frango_individual: { bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-100" },
  frango_duplo: { bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-100" },
  massas: { bg: "bg-orange-50", text: "text-orange-700", accent: "bg-orange-100" },
  porcoes: { bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-100" },
  risotos: { bg: "bg-yellow-50", text: "text-yellow-700", accent: "bg-yellow-100" },
  bebidas_alcoolicas: { bg: "bg-rose-50", text: "text-rose-700", accent: "bg-rose-100" },
  bebidas_nao_alcoolicas: { bg: "bg-cyan-50", text: "text-cyan-700", accent: "bg-cyan-100" },
};

export default function CardapioPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/menu/public");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setCategories(data);
            setActiveTab(data[0]?.name || "");
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

  // Agrupar categorias para as tabs principais
  const mainCategories = [
    { 
      id: "pratos", 
      name: "Pratos Principais", 
      icon: <Utensils className="h-5 w-5" />,
      categories: categories.filter(c => 
        c.name.includes("peixe") || c.name.includes("carne") || c.name.includes("frango")
      )
    },
    { 
      id: "entradas", 
      name: "Entradas", 
      icon: <Salad className="h-5 w-5" />,
      categories: categories.filter(c => c.name === "entradas")
    },
    { 
      id: "massas_risotos", 
      name: "Massas & Risotos", 
      icon: <Soup className="h-5 w-5" />,
      categories: categories.filter(c => c.name === "massas" || c.name === "risotos")
    },
    { 
      id: "porcoes", 
      name: "Porções", 
      icon: <UtensilsCrossed className="h-5 w-5" />,
      categories: categories.filter(c => c.name === "porcoes")
    },
    { 
      id: "bebidas", 
      name: "Bebidas", 
      icon: <Wine className="h-5 w-5" />,
      categories: categories.filter(c => c.name.includes("bebidas"))
    },
  ].filter(group => group.categories.length > 0);

  // Contagem total de itens
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 overflow-hidden">
        {/* Pattern de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Badge className="bg-primary/90 text-white mb-4 text-sm px-4 py-1">
              🍽️ Cardápio Completo
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Nosso Cardápio
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              {totalItems} opções deliciosas preparadas com ingredientes frescos e selecionados
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nome ou ingrediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-white/95 text-foreground border-0 shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Menu */}
      <section className="container mx-auto px-4 py-12">
        {mainCategories.length > 0 ? (
          <Tabs defaultValue={mainCategories[0]?.id} className="w-full">
            {/* Tabs de navegação principal */}
            <TabsList className="flex flex-wrap justify-center gap-2 mb-10 bg-transparent h-auto p-0">
              {mainCategories.map(group => (
                <TabsTrigger 
                  key={group.id}
                  value={group.id} 
                  className="gap-2 px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all bg-white shadow border"
                >
                  {group.icon}
                  <span>{group.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Conteúdo de cada tab */}
            {mainCategories.map(group => (
              <TabsContent key={group.id} value={group.id} className="space-y-12">
                {group.categories.map(category => {
                  const filteredItems = filterItems(category.items);
                  const colors = categoryColors[category.name] || { bg: "bg-slate-50", text: "text-slate-700", accent: "bg-slate-100" };
                  
                  if (filteredItems.length === 0 && searchTerm) return null;
                  
                  return (
                    <div key={category.id} className="scroll-mt-20" id={category.name}>
                      {/* Cabeçalho da categoria */}
                      <div className={`rounded-2xl ${colors.bg} p-6 mb-6`}>
                        <div className="flex items-center gap-4">
                          <div className={`rounded-xl ${colors.accent} p-3 ${colors.text}`}>
                            {iconMapLarge[category.icon || "Utensils"] || <Utensils className="h-8 w-8" />}
                          </div>
                          <div>
                            <h2 className={`text-2xl font-bold ${colors.text}`}>{category.displayName}</h2>
                            <p className="text-muted-foreground">{category.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">{filteredItems.length} itens</p>
                          </div>
                        </div>
                      </div>

                      {/* Grid de itens */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredItems.map((item) => (
                          <Card 
                            key={item.id} 
                            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md bg-white"
                          >
                            <CardContent className="p-5">
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
                                {item.featured && (
                                  <Badge className="bg-primary text-white text-xs">
                                    <Star className="h-3 w-3 mr-1" /> Destaque
                                  </Badge>
                                )}
                                {item.popular && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                                    <Flame className="h-3 w-3 mr-1" /> Popular
                                  </Badge>
                                )}
                                {item.spicy && (
                                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                                    🌶️ Picante
                                  </Badge>
                                )}
                                {item.vegetarian && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                    <Leaf className="h-3 w-3 mr-1" /> Vegetariano
                                  </Badge>
                                )}
                                {item.newItem && (
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" /> Novo
                                  </Badge>
                                )}
                              </div>

                              {/* Nome e descrição */}
                              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[40px]">
                                {item.description || "—"}
                              </p>

                              {/* Preço */}
                              <div className="flex items-center justify-between pt-3 border-t">
                                <span className="text-2xl font-bold text-primary">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {filteredItems.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          Nenhum item encontrado com &quot;{searchTerm}&quot;
                        </div>
                      )}
                    </div>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-16">
            <Utensils className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Cardápio em atualização</h2>
            <p className="text-muted-foreground">Nosso cardápio está sendo preparado. Volte em breve!</p>
          </div>
        )}
      </section>

      {/* Rodapé do cardápio */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center">
          <p className="text-muted-foreground bg-slate-100 rounded-full py-3 px-6 inline-block">
            🍽️ Todos os pratos são preparados na hora • Preços válidos para consumo no salão
          </p>
        </div>
      </section>
    </div>
  );
}
