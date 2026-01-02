"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  Instagram, 
  ExternalLink,
  Navigation,
  Utensils
} from "lucide-react";

// Dados centralizados da Pizzaria
const PIZZARIA_INFO = {
  nome: "Pirata Pizzaria",
  endereco: "Av. Vicente de Carvalho, 48 - Centro",
  cidade: "Bertioga - SP",
  cep: "11250-045",
  telefone: "(13) 99747-3947",
  whatsapp: "5513997473947",
  instagram: "pirata_pizzaria",
  googleMaps: "https://maps.app.goo.gl/CSJCJvA1AaHY6DrF7",
  ifood: "https://www.ifood.com.br/delivery/bertioga-sp/pirata-pizzaria-bertioga-centro/95f172e2-1048-45be-a02f-5c78ada13507",
};

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Olá! Meu nome é ${formData.name}. ${formData.message}`;
    window.open(
      `https://wa.me/${PIZZARIA_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header Compacto */}
      <section className="relative bg-[#0a0a0a] py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-red-700/15 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Entre em <span className="text-red-500">Contato</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto">
              Faça seu pedido, tire dúvidas ou reserve sua mesa
            </p>
          </div>
        </div>
      </section>

      {/* Ações Rápidas + Info Compacto */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Botões de Ação Rápida - Linha única */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
            <a
              href={`https://wa.me/${PIZZARIA_INFO.whatsapp}?text=Olá! Gostaria de fazer um pedido.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg"
            >
              <svg className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="font-semibold text-xs md:text-sm">WhatsApp</span>
            </a>

            <a
              href={`https://instagram.com/${PIZZARIA_INFO.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-lg"
            >
              <Instagram className="h-6 w-6 md:h-8 md:w-8" />
              <span className="font-semibold text-xs md:text-sm">Instagram</span>
            </a>

            <a
              href={PIZZARIA_INFO.ifood}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg"
            >
              <Utensils className="h-6 w-6 md:h-8 md:w-8" />
              <span className="font-semibold text-xs md:text-sm">iFood</span>
            </a>

            <a
              href={PIZZARIA_INFO.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-neutral-700 text-white hover:bg-neutral-600 transition-colors shadow-lg"
            >
              <Navigation className="h-6 w-6 md:h-8 md:w-8" />
              <span className="font-semibold text-xs md:text-sm">Mapa</span>
            </a>
          </div>

          {/* Grid Principal: Formulário + Info */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <Card className="border border-neutral-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2 text-neutral-900">
                    <Send className="h-5 w-5 text-red-600" />
                    Envie uma Mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">Nome *</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(13) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-sm font-medium">Mensagem *</Label>
                      <textarea
                        id="message"
                        placeholder="Como podemos ajudar?"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full h-11 bg-green-600 hover:bg-green-700">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Enviar via WhatsApp
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informações Compactas */}
            <div className="space-y-4">
              {/* Telefone */}
              <a
                href={`https://wa.me/${PIZZARIA_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-neutral-200 bg-white hover:border-green-300 hover:bg-green-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">WhatsApp / Telefone</p>
                    <p className="font-bold text-green-600">{PIZZARIA_INFO.telefone}</p>
                  </div>
                </div>
              </a>

              {/* Endereço */}
              <a
                href={PIZZARIA_INFO.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-neutral-200 bg-white hover:border-red-300 hover:bg-red-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Endereço</p>
                    <p className="font-medium text-neutral-900 text-sm">{PIZZARIA_INFO.endereco}</p>
                    <p className="text-xs text-neutral-500">{PIZZARIA_INFO.cidade}</p>
                  </div>
                </div>
              </a>

              {/* Horários */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-semibold text-neutral-900">Horários</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">🍽️ Almoço</span>
                    <span className="font-medium">Seg-Sex 11h-15h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">🍕 Pizzaria</span>
                    <span className="font-medium">Ter-Dom 18h-23h</span>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <a
                href={`https://instagram.com/${PIZZARIA_INFO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="font-medium">@{PIZZARIA_INFO.instagram}</span>
                <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa Compacto */}
      <section className="bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="aspect-[21/7]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3645.8538654831814!2d-46.14031132469413!3d-23.851485478617927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce1e08c1e4c6db%3A0x18f5e0e1c1e4c6db!2sAv.%20Vicente%20de%20Carvalho%2C%2048%20-%20Centro%2C%20Bertioga%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1704067200000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Pirata Pizzaria"
                  className="w-full h-full"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
