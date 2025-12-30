import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/lib/auth-provider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SessionTimeout } from "@/components/security/SessionTimeout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="lg:pl-64">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
        {/* Componente de timeout de sessão por inatividade */}
        <SessionTimeout />
      </div>
    </AuthProvider>
  );
}

