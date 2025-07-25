"use client";

import MenuScreen from "@/app_features/menu-screen/menu-screen";
import {
  Calendar,
  ClipboardList,
  FileText,
  SprayCanIcon as Spray,
  Search,
  Users,
  Home,
  FileSearch,
  SearchCheck,
  MapPlus,
  MapPinPlus,
  Map,
} from "lucide-react";

import Cookies from "js-cookie";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("agentId");
    Cookies.remove("authToken");
    router.push("/auth/login");
  };

  return (
    <SigenAppLayout
      headerTitle="Página Inicial"
      showLogoutButton
      onLogoutClick={handleLogout}
    >
      <MenuScreen
        menuConfigurations={[
          {
            id: "cadastro-agente",
            label: "Cadastro de Agente",
            icon: <Users className="w-5 h-5" />,
            action: () => router.push("auth/register"),
          },
          {
            id: "relatorio-semanal",
            label: "Relatório semanal",
            icon: <Calendar className="w-5 h-5" />,
            action: () => router.push("chief-agent/weekly-report"),
          },
          {
            id: "cadastro-residencia",
            label: "Cadastro de Residência",
            icon: <Home className="w-5 h-5" />,
            action: () => router.push("chief-agent/register-house"),
          },
          {
            id: "consulta-residencia",
            label: "Consulta de Residência",
            icon: <FileText className="w-5 h-5" />,
            action: () => router.push("chief-agent/residence-consult"),
          },
          {
            id: "pesquisa",
            label: "Pesquisas Pendentes",
            icon: <Search className="w-5 h-5" />,
            action: () => router.push("chief-agent/search-consult"),
          },
          {
            id: "borrifacao-pending",
            label: "Borrifação Pendentes",
            icon: <Spray className="w-5 h-5" />,
            action: () => router.push("chief-agent/spray-consult"),
          },
          {
            id: "cadastro-pit",
            label: "Cadastro de PIT",
            icon: <ClipboardList className="w-5 h-5" />,
            action: () => router.push("chief-agent/pit-register"),
          },
          {
            id: "pesquisa-pit",
            label: "Pesquisa de PIT",
            icon: <SearchCheck className="w-5 h-5" />,
            action: () => router.push("chief-agent/pit-search"),
          },
          {
            id: "location-register",
            label: "Cadastro de Localidade",
            icon: <Map className="w-5 h-5" />,
            action: () => router.push("chief-agent/location-register"),
          },
        ]}
      />
    </SigenAppLayout>
  );
}
