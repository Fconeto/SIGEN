"use client";

import MenuScreen from "@/app_features/menu-screen/menu-screen";
import {
  ClipboardList,
  SprayCanIcon as Spray,
  Search,
  Home,
} from "lucide-react";
import { SigenAppLayout } from "@/components/sigen-app-layout";

export default function HomePage() {
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
            action: () => {
              router.push("/agent/register-house");
            },
          },
          {
            id: "pesquisa",
            label: "Pesquisa",
            icon: <Search className="w-5 h-5" />,
            action: () => {},
          },
          {
            id: "borrifacao",
            label: "Borrifação",
            icon: <Spray className="w-5 h-5" />,
            action: () => {},
          },
          {
            id: "cadastro-pit",
            label: "Cadastro de PIT",
            icon: <ClipboardList className="w-5 h-5" />,
            action: () => {},
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
