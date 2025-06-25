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
} from "lucide-react";
import { SigenAppLayout } from "@/components/sigen-app-layout";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout clicked");
  };

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
