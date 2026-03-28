![Foto Essência](public/banner.jpeg)

# Foto Essência

> Portfolio fotográfico pessoal — praias, cidades, animais e momentos capturados pelo litoral de Santa Catarina e além.

🔗 [fotoessencia.fabiosantos.dev.br](https://fotoessencia.fabiosantos.dev.br)
📸 [@fotoessencia_](https://www.instagram.com/fotoessencia_/)

---

## Sobre

Foto Essência é o espaço onde documento minha visão fotográfica. Mais do que um portfolio, é uma plataforma viva — conectada em tempo real ao Instagram, ao YouTube e à newsletter no Substack, trazendo o conteúdo mais recente automaticamente sem precisar de atualizações manuais.

O projeto também serve como laboratório pessoal: cada componente foi construído do zero para explorar animações, WebGL e interações que vão além do convencional.

---

## O que você vai encontrar

**Galeria** — toda a mídia do Instagram (fotos e vídeos) em grade, com modal de visualização e carregamento progressivo.

**Atividades** — vídeos do YouTube em carrossel interativo, último post do Instagram em destaque e a newsletter completa com leitura inline, suporte a galerias de imagens e vídeos nativos do Substack.

**Komorebi** — landing page do meu app mobile de câmera, desenvolvido em React Native + Expo.

---

## Experiência visual

A interface foi projetada para ser imersiva sem perder a performance:

- **Fundo animado em canvas** com grid de quadrados em movimento diagonal
- **Image trail com WebGL** — fotos do Instagram aparecem seguindo o cursor em 8 variantes de animação diferentes
- **Galeria circular em WebGL** (OGL) com efeito de curvatura e auto-rotação
- **Texto com foco progressivo** animando palavra por palavra
- **Texto scramble** que embaralha caracteres conforme o cursor se aproxima
- **Transições de página** suaves com Framer Motion
- **Scroll animado** com GSAP ScrollTrigger em todos os elementos da página

---

## Tecnologias

| | |
|---|---|
| Interface | React 19 + Vite 7 |
| Animações | GSAP 3 (SplitText, ScrambleText, ScrollTrigger) + Framer Motion 12 |
| WebGL | OGL |
| Dados | Instagram Graph API · YouTube Data API v3 · Substack RSS |
| Analytics | Umami Cloud |
| Deploy | Próprio servidor (Mac mini · Debian · CasaOS) via Tailscale |

---

## Arquitetura

Todo o conteúdo é buscado em tempo real nas respectivas APIs e cacheado localmente para evitar requisições desnecessárias. O RSS do Substack é consumido via proxy para contornar CORS, com parser próprio que extrai galerias e vídeos nativos do Substack e os renderiza com componentes React.

O bundle é dividido em chunks por vendor (React, GSAP, Framer Motion, OGL) e os componentes mais pesados — galeria WebGL e variantes do image trail — são carregados sob demanda com `React.lazy` e dynamic imports.

---

## Outros projetos

- **[Komorebi](https://fotoessencia.fabiosantos.dev.br/komorebi)** — app mobile de câmera com filtros e galeria, em React Native + Expo
