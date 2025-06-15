"use client";

import type React from "react";

import { Card } from "@/components/ui/card";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export interface MenuScreenProps {
  menuConfigurations: MenuItem[];
}

export default function MenuScreen({ menuConfigurations }: MenuScreenProps) {
  return (
    <>
      <div className="flex justify-center py-6">
        <img
          src="/images/endemias.png"
          alt="Imagem sobre endemias"
          className="max-w-full h-auto"
        />
      </div>
      <div className="px-4 space-y-2">
        {menuConfigurations.map((item) => (
          <Card
            key={item.id}
            className="bg-white border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => item.action()}
          >
            <div className="flex items-center gap-2 px-4">
              <div className="text-gray-600">{item.icon}</div>
              <span className="text-gray-800 font-medium">{item.label}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
