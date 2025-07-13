"use client";

import MenuScreen from "@/app_features/menu-screen/menu-screen";
import {
  ClipboardList,
  SprayCanIcon as Spray,
  Search,
  Home,
  FileText,
  FileSearch,
} from "lucide-react";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <SigenAppLayout
      headerTitle="Página Inicial"
      showLogoutButton
      onLogoutClick={() => console.log("Sair")}
    >
      <MenuScreen
        menuConfigurations={[
          {
            id: "cadastro-residencia",
            label: "Cadastro de Residência",
            icon: <Home className="w-5 h-5" />,
            action: () => router.push("/agent/register-house"),
          },
          {
            id: "consulta-residencia",
            label: "Consulta de Residência",
            icon: <FileText className="w-5 h-5" />,
            action: () => router.push("/agent/residence-consult"),
          },
          {
            id: "pesquisa",
            label: "Pesquisa",
            icon: <Search className="w-5 h-5" />,
            action: () => {},
          },
          {
            id: "pesquisa-pending",
            label: "Pesquisas Pendentes",
            icon: <Search className="w-5 h-5" />,
            action: () => router.push("agent/search-consult"),
          },
          {
            id: "borrifacao-pending",
            label: "Borrifações pendentes",
            icon: <Spray className="w-5 h-5" />,
            action: () => router.push("/agent/spray-consult"),
          },
          {
            id: "borrifacao",
            label: "Borrifação",
            icon: <Spray className="w-5 h-5" />,
            action: () => router.push("/agent/spray-control"),
          },
          {
            id: "cadastro-pesquisa",
            label: "Cadastro de Pesquisa",
            icon: <FileSearch className="w-5 h-5" />,
            action: () => router.push("agent/search-register"),
          },
          {
            id: "cadastro-pit",
            label: "Cadastro de PIT",
            icon: <ClipboardList className="w-5 h-5" />,
            action: () => router.push("agent/pit-register"),
          },
          {
            id: "pesquisa-pit",
            label: "Pesquisa de PIT",
            icon: <Search className="w-5 h-5" />,
            action: () => {},
          },
        ]}
      />
    </SigenAppLayout>
  );
}
