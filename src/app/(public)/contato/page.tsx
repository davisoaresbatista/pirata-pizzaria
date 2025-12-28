"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode integrar com um serviço de email ou WhatsApp
    const whatsappMessage = `Olá! Meu nome é ${formData.name}. ${formData.message}`;
    window.open(
      `https://wa.me/5513999999999?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
  };

  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Fale Conosco
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Entre em Contato
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou quer fazer um pedido? Estamos aqui para ajudar!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Envie uma Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <textarea
                    id="message"
                    placeholder="Como podemos ajudar?"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="border-0 shadow-lg bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Pedidos e Reservas</h3>
                <p className="text-primary-foreground/80 mb-4">
                  A forma mais rápida de fazer seu pedido é pelo WhatsApp:
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    window.open(
                      "https://wa.me/5513999999999?text=Olá! Gostaria de fazer um pedido.",
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  (13) 99999-9999
                </Button>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Endereço</h4>
                    <p className="text-sm text-muted-foreground">
                      Bertioga - SP
                      <br />
                      Litoral Paulista
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Telefone</h4>
                    <p className="text-sm text-muted-foreground">
                      (13) 99999-9999
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      contato@piratapizzaria.com.br
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Horários</h4>
                    <p className="text-sm text-muted-foreground">
                      Almoço: Seg-Sex 11h-15h
                      <br />
                      Pizza: Ter-Dom 18h-23h
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Redes Sociais</h4>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="aspect-[21/9] bg-secondary flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aqui você pode incorporar o Google Maps com a localização da pizzaria
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Cole o iframe do Google Maps neste local
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

