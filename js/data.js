(function () {
  "use strict";

  window.CYBERBUS_DATA = {
    code: "BR1024",
    date: "7 de setembro de 2026",
    status: {
      label: "Em viagem",
      punctuality: "No horário",
      message: "Tudo segue conforme o planejado"
    },
    route: {
      origin: "Rio de Janeiro",
      originCode: "RIO",
      originTerminal: "Rodoviária Novo Rio",
      destination: "São Paulo",
      destinationCode: "SAO",
      destinationTerminal: "Terminal Rodoviário Tietê",
      departure: "14:00",
      boarding: "13:40",
      boardingCloses: "13:55",
      estimatedArrival: "21:00",
      duration: "7h",
      platform: "12",
      sector: "Setor B",
      totalDistance: 430,
      coordinates: {
        origin: [-22.8971, -43.2096],
        destination: [-23.5163, -46.6254]
      }
    },
    bus: {
      company: "Viação Horizonte",
      number: "2312",
      plate: "RJX8D45",
      model: "Marcopolo Paradiso G8 1800 DD",
      year: 2023,
      color: "Azul-marinho com faixa azul-ciano",
      accessibility: "Elevador e espaço acessível",
      amenities: ["Wi-Fi", "USB individual", "Ar-condicionado", "Banheiro"],
      image: "assets/images/bus-cyberbus.jpg"
    },
    driver: {
      name: "João Carlos Mendes",
      experience: "12 anos de experiência"
    },
    simulation: {
      initialProgress: 45,
      speed: 82,
      updateInterval: 5000,
      progressStep: 0.7,
      startedLabel: "17:12",
      polyline: [
        [6, 78], [14, 71], [23, 69], [31, 62], [39, 57],
        [48, 52], [57, 48], [66, 39], [75, 34], [85, 23], [94, 16]
      ]
    },
    stops: [
      {
        id: "rio-de-janeiro",
        city: "Rio de Janeiro",
        name: "Rodoviária Novo Rio",
        shortName: "Novo Rio",
        type: "origin",
        scheduled: "14:00",
        actual: "14:02",
        departure: "14:02",
        duration: 0,
        progress: 0,
        distanceFromOrigin: 0,
        location: "Santo Cristo, Rio de Janeiro — RJ",
        coordinates: [-22.8971, -43.2096],
        mapPosition: [6, 78],
        openingHours: "Aberto 24 horas",
        description: "Terminal de origem da viagem.",
        services: ["Banheiro", "Wi-Fi", "Alimentação", "Bilheteria", "Caixa eletrônico"]
      },
      {
        id: "resende",
        city: "Resende",
        name: "Parada Vale Real",
        shortName: "Vale Real",
        type: "stop",
        scheduled: "16:10",
        actual: "16:08",
        departure: "16:33",
        duration: 25,
        progress: 39,
        distanceFromOrigin: 168,
        location: "Rodovia Presidente Dutra, km 163 — Resende, RJ",
        coordinates: [-22.4673, -44.4478],
        mapPosition: [39, 57],
        openingHours: "Aberto 24 horas",
        description: "Parada ampla com refeições, café, conveniência e estrutura acessível.",
        services: ["Restaurante", "Lanchonete", "Café", "Banheiro", "Wi-Fi", "Estacionamento", "Loja", "Conveniência", "Caixa eletrônico"]
      },
      {
        id: "aparecida",
        city: "Aparecida",
        name: "Pátio da Fé",
        shortName: "Aparecida",
        type: "stop",
        scheduled: "18:20",
        estimated: "18:17",
        duration: 20,
        progress: 64,
        distanceFromOrigin: 275,
        location: "Rodovia Presidente Dutra, km 71 — Aparecida, SP",
        coordinates: [-22.8469, -45.2307],
        mapPosition: [66, 39],
        openingHours: "06:00 às 23:00",
        description: "Parada prevista para descanso e alimentação.",
        services: ["Restaurante", "Café", "Banheiro", "Wi-Fi", "Estacionamento", "Conveniência"]
      },
      {
        id: "sao-jose-dos-campos",
        city: "São José dos Campos",
        name: "Terminal Rodoviário Frederico Ozanam",
        shortName: "São José",
        type: "stop",
        scheduled: "19:30",
        estimated: "19:28",
        duration: 10,
        progress: 80,
        distanceFromOrigin: 344,
        location: "Centro, São José dos Campos — SP",
        coordinates: [-23.1848, -45.8841],
        mapPosition: [75, 34],
        openingHours: "Aberto 24 horas",
        description: "Última parada prevista antes do destino final.",
        services: ["Banheiro", "Café", "Wi-Fi", "Bilheteria", "Táxi"]
      },
      {
        id: "sao-paulo",
        city: "São Paulo",
        name: "Terminal Rodoviário Tietê",
        shortName: "Tietê",
        type: "destination",
        scheduled: "21:00",
        estimated: "21:00",
        duration: 0,
        progress: 100,
        distanceFromOrigin: 430,
        location: "Santana, São Paulo — SP",
        coordinates: [-23.5163, -46.6254],
        mapPosition: [94, 16],
        openingHours: "Aberto 24 horas",
        description: "Destino final da viagem.",
        services: ["Banheiro", "Alimentação", "Wi-Fi", "Metrô", "Táxi", "Aplicativos de mobilidade"]
      }
    ],
    terminal: {
      name: "Rodoviária Novo Rio",
      start: "Entrada principal",
      destination: "Plataforma 12",
      walkingTime: "4 min",
      distance: "280 m",
      directions: [
        { title: "Entrada principal", detail: "Siga em frente pelo acesso central" },
        { title: "Corredor central", detail: "Passe pelo ponto de informações" },
        { title: "Setor B", detail: "Use a sinalização azul à direita" },
        { title: "Plataforma 12", detail: "Seu ônibus estará identificado como 2312" }
      ]
    },
    establishments: [
      {
        id: "cozinha-vale-real",
        stopId: "resende",
        name: "Cozinha Vale Real",
        category: "Restaurantes",
        description: "Comida brasileira preparada ao longo do dia, com buffet variado e opções leves.",
        rating: 4.6,
        reviews: 328,
        hours: "Aberto 24h",
        priceRange: "R$ 25–60",
        location: "Salão principal, ao lado da entrada",
        image: "assets/images/restaurante-vale-real.jpg",
        products: ["Buffet brasileiro", "Pratos grelhados", "Saladas"],
        tags: ["Restaurantes"],
        menu: [
          {
            section: "Refeições",
            items: [
              { name: "Prato executivo", description: "Arroz, feijão, salada e proteína do dia", price: "R$ 39,90" },
              { name: "Filé com fritas", description: "Filé acebolado, arroz e batatas fritas", price: "R$ 47,90" },
              { name: "Frango grelhado", description: "Frango, legumes e arroz", price: "R$ 35,90" }
            ]
          },
          {
            section: "Lanches",
            items: [
              { name: "X-Burger", description: "Pão, hambúrguer, queijo e salada", price: "R$ 27,90" },
              { name: "Sanduíche natural", description: "Frango, cenoura e folhas", price: "R$ 19,90" }
            ]
          },
          {
            section: "Bebidas",
            items: [
              { name: "Água", description: "Garrafa 500 ml", price: "R$ 6,00" },
              { name: "Café", description: "Espresso ou coado", price: "R$ 8,00" },
              { name: "Suco", description: "Sabores do dia", price: "R$ 10,00" }
            ]
          }
        ]
      },
      {
        id: "cafe-km-163",
        stopId: "resende",
        name: "Café KM 163",
        category: "Cafés",
        description: "Cafés, pães de queijo e lanches rápidos para seguir viagem.",
        rating: 4.7,
        reviews: 214,
        hours: "06:00 às 23:30",
        priceRange: "R$ 8–32",
        location: "Galeria central, loja 04",
        image: "assets/images/cafe-km163.jpg",
        products: ["Café espresso", "Pão de queijo", "Sanduíches"],
        tags: ["Cafés", "Lanches"],
        menu: [
          {
            section: "Mais pedidos",
            items: [
              { name: "Combo de viagem", description: "Café médio e 3 pães de queijo", price: "R$ 18,90" },
              { name: "Cappuccino", description: "Café, leite vaporizado e canela", price: "R$ 12,00" },
              { name: "Misto quente", description: "Pão, queijo e presunto", price: "R$ 16,90" }
            ]
          }
        ]
      },
      {
        id: "ponto-express",
        stopId: "resende",
        name: "Ponto Express",
        category: "Conveniência",
        description: "Bebidas, higiene, itens de viagem e snacks para levar.",
        rating: 4.4,
        reviews: 186,
        hours: "Aberto 24h",
        priceRange: "R$ 5–45",
        location: "Próximo aos caixas eletrônicos",
        image: "assets/images/cafe-km163.jpg",
        products: ["Bebidas", "Snacks", "Itens de viagem"],
        tags: ["Conveniência", "Lanches"],
        menu: [
          {
            section: "Para levar",
            items: [
              { name: "Kit viagem", description: "Água, snack e lenço de papel", price: "R$ 24,90" },
              { name: "Mix de castanhas", description: "Pacote 100 g", price: "R$ 13,90" }
            ]
          }
        ]
      },
      {
        id: "emporio-mantiqueira",
        stopId: "resende",
        name: "Empório Mantiqueira",
        category: "Lojas",
        description: "Produtos regionais, lembranças e pequenos presentes.",
        rating: 4.5,
        reviews: 92,
        hours: "07:00 às 22:00",
        priceRange: "R$ 12–95",
        location: "Galeria central, loja 07",
        image: "assets/images/cafe-km163.jpg",
        products: ["Doces regionais", "Presentes", "Artesanato"],
        tags: ["Lojas", "Conveniência"],
        menu: [
          {
            section: "Destaques",
            items: [
              { name: "Doce de leite artesanal", description: "Pote 400 g", price: "R$ 28,00" },
              { name: "Café da Mantiqueira", description: "Pacote 250 g", price: "R$ 34,90" }
            ]
          }
        ]
      },
      {
        id: "sabores-da-fe",
        stopId: "aparecida",
        name: "Sabores da Fé",
        category: "Restaurantes",
        description: "Refeições brasileiras servidas rapidamente, com pratos feitos e saladas.",
        rating: 4.5,
        reviews: 241,
        hours: "06:00 às 23:00",
        priceRange: "R$ 24–52",
        location: "Bloco A, em frente ao estacionamento",
        image: "assets/images/restaurante-vale-real.jpg",
        products: ["Pratos feitos", "Grelhados", "Saladas"],
        tags: ["Restaurantes"],
        menu: [
          {
            section: "Refeições rápidas",
            items: [
              { name: "Executivo da casa", description: "Arroz, feijão, salada e proteína", price: "R$ 36,90" },
              { name: "Omelete com salada", description: "Omelete de queijo e folhas frescas", price: "R$ 28,90" }
            ]
          }
        ]
      },
      {
        id: "cafe-da-praca",
        stopId: "aparecida",
        name: "Café da Praça",
        category: "Cafés",
        description: "Cafés, salgados assados e doces para uma pausa curta.",
        rating: 4.6,
        reviews: 174,
        hours: "06:00 às 22:30",
        priceRange: "R$ 7–29",
        location: "Bloco B, próximo aos banheiros",
        image: "assets/images/cafe-km163.jpg",
        products: ["Café coado", "Salgados", "Doces"],
        tags: ["Cafés", "Lanches"],
        menu: [
          {
            section: "Café e lanche",
            items: [
              { name: "Café com pão de queijo", description: "Café médio e 2 pães de queijo", price: "R$ 15,90" },
              { name: "Empada de frango", description: "Unidade assada", price: "R$ 11,90" }
            ]
          }
        ]
      },
      {
        id: "estacao-sabor-sjc",
        stopId: "sao-jose-dos-campos",
        name: "Estação Sabor",
        category: "Lanches",
        description: "Sanduíches quentes, salgados e bebidas com atendimento expresso.",
        rating: 4.4,
        reviews: 132,
        hours: "05:30 às 23:30",
        priceRange: "R$ 10–38",
        location: "Piso térreo, loja 12",
        image: "assets/images/cafe-km163.jpg",
        products: ["Sanduíches", "Salgados", "Bebidas"],
        tags: ["Lanches", "Cafés"],
        menu: [
          {
            section: "Para levar",
            items: [
              { name: "Sanduíche de frango", description: "Frango, queijo e salada", price: "R$ 22,90" },
              { name: "Suco e salgado", description: "Suco 300 ml e salgado assado", price: "R$ 17,90" }
            ]
          }
        ]
      },
      {
        id: "viagem-express-sjc",
        stopId: "sao-jose-dos-campos",
        name: "Viagem Express",
        category: "Conveniência",
        description: "Água, snacks, higiene e itens essenciais para o trecho final.",
        rating: 4.3,
        reviews: 108,
        hours: "Aberto 24h",
        priceRange: "R$ 5–42",
        location: "Piso térreo, próximo à plataforma 8",
        image: "assets/images/cafe-km163.jpg",
        products: ["Água", "Snacks", "Higiene"],
        tags: ["Conveniência", "Lojas"],
        menu: [
          {
            section: "Essenciais",
            items: [
              { name: "Água sem gás", description: "Garrafa 500 ml", price: "R$ 6,00" },
              { name: "Kit higiene", description: "Escova e creme dental", price: "R$ 16,90" }
            ]
          }
        ]
      }
    ],
    safety: {
      supportProtocol: "CB-DEMO-2407",
      notice: "Esta é uma demonstração. Nenhum serviço de emergência real será acionado.",
      sharedFields: ["Localização GPS em tempo real (simulada neste protótipo)", "Número e placa do ônibus", "Empresa e motorista", "Origem, destino e rota", "Horário e posição da viagem"]
    }
  };
}());
