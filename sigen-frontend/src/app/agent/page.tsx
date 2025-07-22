"use client";

import MenuScreen from "@/app_features/menu-screen/menu-screen";
import {
  ClipboardList,
  SprayCanIcon as Spray,
  Search,
  Home,
  FileSearch,
  SearchCheck,
  FileText,
  Map,
} from "lucide-react";

import Cookies from "js-cookie";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userData");
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
            id: "cadastro-pit",
            label: "Cadastro de PIT",
            icon: <ClipboardList className="w-5 h-5" />,
            action: () => router.push("agent/pit-register"),
          },
          {
            id: "pesquisa-pit",
            label: "Pesquisa de PIT",
            icon: <SearchCheck className="w-5 h-5" />,
            action: () => router.push("agent/pit-search"),
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
