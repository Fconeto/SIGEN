# SIGEN - Sistema Integrado de Gestão de Endemias

O SIGEN é uma aplicação web desenvolvida com o objetivo de auxiliar os agentes de endemias no processo de visita, coleta e acompanhamento de dados em imóveis, com funcionalidades como registro de pesquisas de campo, alertas de borrifação e recebimento de insetos via PIT.

---

## 📁 Estrutura do Projeto

O sistema utiliza **Clean Architecture**, princípios **SOLID** e **Clean Code** para garantir alta manutenibilidade e organização.

```
SIGEN/
├── SIGEN.Domain/         # Entidades e interfaces de domínio (núcleo)
├── SIGEN.Application/    # Casos de uso e regras da aplicação
├── SIGEN.Infrastructure/ # Implementações externas (DB, repositórios, etc.)
├── SIGEN.API/            # Web API (.NET) com endpoints REST
├── SIGEN.Tests/          # Testes unitários e de integração
├── frontend/             # Aplicação React (PWA)
└── .vscode/              # Configurações do VS Code (extensões recomendadas, etc.)
```

---

## 📚 Convenções e Boas Práticas

- Código dividido por camadas respeitando Clean Architecture
- Aplicar princípios SOLID em serviços e entidades
- Usar interfaces para abstrações de repositórios
- Aplicar validações nas camadas de aplicação
- Separar DTOs, Models e Entidades
- Testar serviços críticos com xUnit

---

## 🧠 Contribuindo

1. Faça um fork
2. Crie uma branch com a sua feature:
   `git checkout -b feature/[id_da_us]-[id_da_task]`
   `Ex: git checkout -b feature/7-10`
3. Commit suas mudanças:
   `git commit -m 'feat: adiciona nova feature'`
4. Faça push para sua branch:
   `git push origin feature/[id_da_us]-[id_da_task]`
   `Ex: git push origin feature/7-10`
5. Abra um Pull Request

---
