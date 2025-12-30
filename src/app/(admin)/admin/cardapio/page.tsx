"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pizza,
  Plus,
  Pencil,
  Trash2,
  Star,
  Flame,
  Leaf,
  Sparkles,
  AlertTriangle,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
  ExternalLink,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  featured: boolean;
  popular: boolean;
  spicy: boolean;
  vegetarian: boolean;
  newItem: boolean;
  imageUrl: string | null;
  order: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    displayName: string;
  };
}

interface MenuCategory {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  _count?: { items: number };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function CardapioAdminPage() {
  // Estados
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Novos estados de filtros
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [tagsFilter, setTagsFilter] = useState<{
    featured: boolean | null;
    popular: boolean | null;
    spicy: boolean | null;
    vegetarian: boolean | null;
    newItem: boolean | null;
  }>({
    featured: null,
    popular: null,
    spicy: null,
    vegetarian: null,
    newItem: null,
  });
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Estados do modal de item
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    active: true,
    featured: false,
    popular: false,
    spicy: false,
    vegetarian: false,
    newItem: false,
  });

  // Estados do modal de categoria
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    displayName: "",
    description: "",
    icon: "Pizza",
    order: 0,
    active: true,
  });

  // Estado do modal de confirmação de exclusão
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    type: "item" | "category";
    id: string;
    name: string;
  }>({ open: false, type: "item", id: "", name: "" });

  // ============================================================================
  // FETCH DATA
  // ============================================================================

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/menu/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/menu/items");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCategories(), fetchItems()]);
    setLoading(false);
  }, [fetchCategories, fetchItems]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ============================================================================
  // ITEM HANDLERS
  // ============================================================================

  const openItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || "",
        price: String(item.price),
        active: item.active,
        featured: item.featured,
        popular: item.popular,
        spicy: item.spicy,
        vegetarian: item.vegetarian,
        newItem: item.newItem,
      });
    } else {
      setEditingItem(null);
      setItemForm({
        categoryId: categories[0]?.id || "",
        name: "",
        description: "",
        price: "",
        active: true,
        featured: false,
        popular: false,
        spicy: false,
        vegetarian: false,
        newItem: false,
      });
    }
    setIsItemModalOpen(true);
  };

  const saveItem = async () => {
    setSaving(true);
    try {
      const url = editingItem
        ? `/api/menu/items/${editingItem.id}`
        : "/api/menu/items";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...itemForm,
          price: parseFloat(itemForm.price) || 0,
        }),
      });

      if (res.ok) {
        setIsItemModalOpen(false);
        fetchAll();
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao salvar item");
      }
    } catch (error) {
      console.error("Erro ao salvar item:", error);
      alert("Erro ao salvar item");
    } finally {
      setSaving(false);
    }
  };

  const toggleItemActive = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active }),
      });

      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    }
  };

  const deleteItem = async () => {
    try {
      const res = await fetch(`/api/menu/items/${deleteModal.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteModal({ ...deleteModal, open: false });
        fetchAll();
      }
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    }
  };

  // ============================================================================
  // CATEGORY HANDLERS
  // ============================================================================

  const openCategoryModal = (category?: MenuCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        displayName: category.displayName,
        description: category.description || "",
        icon: category.icon || "Pizza",
        order: category.order,
        active: category.active,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        displayName: "",
        description: "",
        icon: "Pizza",
        order: categories.length,
        active: true,
      });
    }
    setIsCategoryModalOpen(true);
  };

  const saveCategory = async () => {
    setSaving(true);
    try {
      const url = editingCategory
        ? `/api/menu/categories/${editingCategory.id}`
        : "/api/menu/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        setIsCategoryModalOpen(false);
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao salvar categoria");
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar categoria");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    try {
      const res = await fetch(`/api/menu/categories/${deleteModal.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteModal({ ...deleteModal, open: false });
        fetchAll();
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  const filteredItems = items.filter((item) => {
    // Filtro por busca
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por categoria
    const matchesCategory =
      selectedCategory === "all" || item.categoryId === selectedCategory;

    // Filtro por status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.active) ||
      (statusFilter === "inactive" && !item.active);

    // Filtro por tags
    const matchesTags =
      (tagsFilter.featured === null || item.featured === tagsFilter.featured) &&
      (tagsFilter.popular === null || item.popular === tagsFilter.popular) &&
      (tagsFilter.spicy === null || item.spicy === tagsFilter.spicy) &&
      (tagsFilter.vegetarian === null || item.vegetarian === tagsFilter.vegetarian) &&
      (tagsFilter.newItem === null || item.newItem === tagsFilter.newItem);

    // Filtro por faixa de preço
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = Number(item.price) >= minPrice && Number(item.price) <= maxPrice;

    return matchesSearch && matchesCategory && matchesStatus && matchesTags && matchesPrice;
  });

  // Conta quantos filtros estão ativos
  const activeFiltersCount = [
    statusFilter !== "all",
    tagsFilter.featured !== null,
    tagsFilter.popular !== null,
    tagsFilter.spicy !== null,
    tagsFilter.vegetarian !== null,
    tagsFilter.newItem !== null,
    priceRange.min !== "",
    priceRange.max !== "",
  ].filter(Boolean).length;

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setStatusFilter("all");
    setTagsFilter({
      featured: null,
      popular: null,
      spicy: null,
      vegetarian: null,
      newItem: null,
    });
    setPriceRange({ min: "", max: "" });
  };

  // ============================================================================
  // FORMAT HELPERS
  // ============================================================================

  const formatPrice = (price: number) =>
    `R$ ${Number(price).toFixed(2).replace(".", ",")}`;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Pizza className="h-8 w-8" />
            Cardápio
          </h1>
          <p className="text-muted-foreground">
            Gerencie categorias e itens do cardápio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Link href="/cardapio" target="_blank">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Cardápio
            </Button>
          </Link>
          <Button onClick={() => openItemModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Pizza className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.filter((c) => c.active).length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              {items.filter((i) => i.active).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destaques</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.filter((i) => i.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">itens em destaque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novidades</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.filter((i) => i.newItem).length}
            </div>
            <p className="text-xs text-muted-foreground">itens novos</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>Gerencie as categorias do cardápio</CardDescription>
          </div>
          <Button size="sm" onClick={() => openCategoryModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  category.active
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/50 border-muted"
                }`}
              >
                <span className="font-medium">{category.displayName}</span>
                <Badge variant="secondary" className="text-xs">
                  {category._count?.items || 0}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => openCategoryModal(category)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            {/* Linha principal: título + busca + filtros */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Itens do Cardápio</CardTitle>
                <CardDescription>
                  {filteredItems.length} de {items.length} itens
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 text-primary">
                      ({activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} ativo{activeFiltersCount > 1 ? "s" : ""})
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[180px]"
                  />
                </div>

                {/* Categoria */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status */}
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>

                {/* Botão de filtros avançados */}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {/* Botão limpar filtros */}
                {(activeFiltersCount > 0 || searchTerm || selectedCategory !== "all") && (
                  <Button variant="ghost" size="icon" onClick={clearAllFilters} title="Limpar filtros">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Painel de filtros avançados */}
            {showFilters && (
              <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros Avançados
                  </h4>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Limpar Todos
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Filtro por Tags */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={tagsFilter.featured === true ? "default" : tagsFilter.featured === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          setTagsFilter({
                            ...tagsFilter,
                            featured: tagsFilter.featured === null ? true : tagsFilter.featured === true ? false : null,
                          })
                        }
                        className="gap-1"
                      >
                        <Star className="h-3 w-3" />
                        Destaque
                        {tagsFilter.featured === true && "✓"}
                        {tagsFilter.featured === false && "✗"}
                      </Button>

                      <Button
                        variant={tagsFilter.popular === true ? "default" : tagsFilter.popular === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          setTagsFilter({
                            ...tagsFilter,
                            popular: tagsFilter.popular === null ? true : tagsFilter.popular === true ? false : null,
                          })
                        }
                        className="gap-1"
                      >
                        <Flame className="h-3 w-3" />
                        Popular
                        {tagsFilter.popular === true && "✓"}
                        {tagsFilter.popular === false && "✗"}
                      </Button>

                      <Button
                        variant={tagsFilter.spicy === true ? "default" : tagsFilter.spicy === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          setTagsFilter({
                            ...tagsFilter,
                            spicy: tagsFilter.spicy === null ? true : tagsFilter.spicy === true ? false : null,
                          })
                        }
                        className="gap-1"
                      >
                        🌶️ Picante
                        {tagsFilter.spicy === true && "✓"}
                        {tagsFilter.spicy === false && "✗"}
                      </Button>

                      <Button
                        variant={tagsFilter.vegetarian === true ? "default" : tagsFilter.vegetarian === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          setTagsFilter({
                            ...tagsFilter,
                            vegetarian: tagsFilter.vegetarian === null ? true : tagsFilter.vegetarian === true ? false : null,
                          })
                        }
                        className="gap-1"
                      >
                        <Leaf className="h-3 w-3" />
                        Vegetariano
                        {tagsFilter.vegetarian === true && "✓"}
                        {tagsFilter.vegetarian === false && "✗"}
                      </Button>

                      <Button
                        variant={tagsFilter.newItem === true ? "default" : tagsFilter.newItem === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          setTagsFilter({
                            ...tagsFilter,
                            newItem: tagsFilter.newItem === null ? true : tagsFilter.newItem === true ? false : null,
                          })
                        }
                        className="gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        Novidade
                        {tagsFilter.newItem === true && "✓"}
                        {tagsFilter.newItem === false && "✗"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Clique para alternar: sem filtro → com tag → sem tag
                    </p>
                  </div>

                  {/* Filtro por Faixa de Preço */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Faixa de Preço</Label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                        <Input
                          type="number"
                          placeholder="Mín"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                      <span className="text-muted-foreground">até</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                        <Input
                          type="number"
                          placeholder="Máx"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Atalhos de preço */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Atalhos de Preço</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPriceRange({ min: "", max: "50" })}
                      >
                        Até R$ 50
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPriceRange({ min: "50", max: "70" })}
                      >
                        R$ 50 - 70
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPriceRange({ min: "70", max: "" })}
                      >
                        Acima de R$ 70
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Resumo dos filtros ativos */}
                {(activeFiltersCount > 0 || searchTerm || selectedCategory !== "all") && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1">
                        Busca: "{searchTerm}"
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSearchTerm("")}
                        />
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        Categoria: {categories.find((c) => c.id === selectedCategory)?.displayName}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedCategory("all")}
                        />
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        Status: {statusFilter === "active" ? "Ativos" : "Inativos"}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setStatusFilter("all")}
                        />
                      </Badge>
                    )}
                    {tagsFilter.featured !== null && (
                      <Badge variant="secondary" className="gap-1">
                        Destaque: {tagsFilter.featured ? "Sim" : "Não"}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setTagsFilter({ ...tagsFilter, featured: null })}
                        />
                      </Badge>
                    )}
                    {tagsFilter.popular !== null && (
                      <Badge variant="secondary" className="gap-1">
                        Popular: {tagsFilter.popular ? "Sim" : "Não"}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setTagsFilter({ ...tagsFilter, popular: null })}
                        />
                      </Badge>
                    )}
                    {tagsFilter.spicy !== null && (
                      <Badge variant="secondary" className="gap-1">
                        Picante: {tagsFilter.spicy ? "Sim" : "Não"}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setTagsFilter({ ...tagsFilter, spicy: null })}
                        />
                      </Badge>
                    )}
                    {tagsFilter.vegetarian !== null && (
                      <Badge variant="secondary" className="gap-1">
                        Vegetariano: {tagsFilter.vegetarian ? "Sim" : "Não"}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setTagsFilter({ ...tagsFilter, vegetarian: null })}
                        />
                      </Badge>
                    )}
                    {tagsFilter.newItem !== null && (
                      <Badge variant="secondary" className="gap-1">
                        Novidade: {tagsFilter.newItem ? "Sim" : "Não"}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setTagsFilter({ ...tagsFilter, newItem: null })}
                        />
                      </Badge>
                    )}
                    {priceRange.min && (
                      <Badge variant="secondary" className="gap-1">
                        Preço mín: R$ {priceRange.min}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setPriceRange({ ...priceRange, min: "" })}
                        />
                      </Badge>
                    )}
                    {priceRange.max && (
                      <Badge variant="secondary" className="gap-1">
                        Preço máx: R$ {priceRange.max}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setPriceRange({ ...priceRange, max: "" })}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {loading ? "Carregando..." : "Nenhum item encontrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} className={!item.active ? "opacity-50" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.category?.displayName}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {item.featured && (
                            <Badge className="bg-yellow-500 text-xs">
                              <Star className="h-3 w-3" />
                            </Badge>
                          )}
                          {item.popular && (
                            <Badge className="bg-orange-500 text-xs">
                              <Flame className="h-3 w-3" />
                            </Badge>
                          )}
                          {item.spicy && (
                            <Badge className="bg-red-500 text-xs">🌶️</Badge>
                          )}
                          {item.vegetarian && (
                            <Badge className="bg-green-500 text-xs">
                              <Leaf className="h-3 w-3" />
                            </Badge>
                          )}
                          {item.newItem && (
                            <Badge className="bg-purple-500 text-xs">
                              <Sparkles className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItemActive(item)}
                          className={item.active ? "text-green-600" : "text-muted-foreground"}
                        >
                          {item.active ? (
                            <>
                              <Eye className="h-4 w-4 mr-1" /> Ativo
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" /> Oculto
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openItemModal(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                type: "item",
                                id: item.id,
                                name: item.name,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Item */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Item" : "Novo Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Edite as informações do item"
                : "Adicione um novo item ao cardápio"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Categoria</Label>
                <Select
                  value={itemForm.categoryId}
                  onValueChange={(v) => setItemForm({ ...itemForm, categoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Nome</Label>
                <Input
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="Ex: Marguerita"
                />
              </div>

              <div className="col-span-2">
                <Label>Descrição</Label>
                <Input
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Ex: Mussarela, tomate e manjericão"
                />
              </div>

              <div>
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  placeholder="0,00"
                />
              </div>

              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="active"
                    checked={itemForm.active}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, active: !!c })}
                  />
                  <Label htmlFor="active">Ativo</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={itemForm.featured}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, featured: !!c })}
                  />
                  <Label htmlFor="featured" className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" /> Destaque
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="popular"
                    checked={itemForm.popular}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, popular: !!c })}
                  />
                  <Label htmlFor="popular" className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" /> Popular
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="spicy"
                    checked={itemForm.spicy}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, spicy: !!c })}
                  />
                  <Label htmlFor="spicy">🌶️ Picante</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="vegetarian"
                    checked={itemForm.vegetarian}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, vegetarian: !!c })}
                  />
                  <Label htmlFor="vegetarian" className="flex items-center gap-1">
                    <Leaf className="h-4 w-4 text-green-500" /> Vegetariano
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="newItem"
                    checked={itemForm.newItem}
                    onCheckedChange={(c) => setItemForm({ ...itemForm, newItem: !!c })}
                  />
                  <Label htmlFor="newItem" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-purple-500" /> Novidade
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveItem} disabled={saving || !itemForm.name || !itemForm.categoryId}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Categoria */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!editingCategory && (
              <div>
                <Label>Nome interno (sem espaços)</Label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value.toLowerCase().replace(/\s/g, "_"),
                    })
                  }
                  placeholder="Ex: pizzas_especiais"
                />
              </div>
            )}

            <div>
              <Label>Nome de exibição</Label>
              <Input
                value={categoryForm.displayName}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, displayName: e.target.value })
                }
                placeholder="Ex: Pizzas Especiais"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Input
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, description: e.target.value })
                }
                placeholder="Ex: Nossas pizzas mais especiais"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ícone</Label>
                <Select
                  value={categoryForm.icon}
                  onValueChange={(v) => setCategoryForm({ ...categoryForm, icon: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pizza">🍕 Pizza</SelectItem>
                    <SelectItem value="Cake">🎂 Cake (Doces)</SelectItem>
                    <SelectItem value="Wine">🍷 Wine (Bebidas)</SelectItem>
                    <SelectItem value="IceCream">🍨 IceCream (Sobremesas)</SelectItem>
                    <SelectItem value="Utensils">🍴 Utensils (Pratos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="catActive"
                checked={categoryForm.active}
                onCheckedChange={(c) => setCategoryForm({ ...categoryForm, active: !!c })}
              />
              <Label htmlFor="catActive">Categoria ativa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
              Cancelar
            </Button>
            {editingCategory && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setDeleteModal({
                    open: true,
                    type: "category",
                    id: editingCategory.id,
                    name: editingCategory.displayName,
                  });
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
            <Button onClick={saveCategory} disabled={saving || !categoryForm.displayName}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmação de Exclusão */}
      <Dialog open={deleteModal.open} onOpenChange={(o) => setDeleteModal({ ...deleteModal, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{deleteModal.name}</strong>?
              {deleteModal.type === "category" &&
                " Todos os itens desta categoria serão excluídos."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ ...deleteModal, open: false })}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={deleteModal.type === "item" ? deleteItem : deleteCategory}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
