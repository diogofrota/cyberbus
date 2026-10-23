(function () {
  "use strict";

  window.CYBERBUS_DATA = {
    code: "BR1024",
    date: new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date()),
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
      },
      mapPath: [
        [-22.898111, -43.20912], [-22.889172, -43.216803], [-22.884859, -43.226905],
        [-22.886171, -43.234133], [-22.869451, -43.246918], [-22.845984, -43.248113],
        [-22.816208, -43.288161], [-22.814233, -43.295344], [-22.819654, -43.311526],
        [-22.818834, -43.319389], [-22.779533, -43.394133], [-22.74089, -43.455068],
        [-22.737499, -43.490176], [-22.744221, -43.510541], [-22.735262, -43.553174],
        [-22.729874, -43.562711], [-22.731633, -43.619821], [-22.71387, -43.732965],
        [-22.705624, -43.739512], [-22.700174, -43.751189], [-22.700928, -43.759256],
        [-22.692851, -43.772388], [-22.694435, -43.77898], [-22.686157, -43.812223],
        [-22.667614, -43.818025], [-22.663699, -43.824791], [-22.659289, -43.826294],
        [-22.654653, -43.817878], [-22.651304, -43.818652], [-22.653682, -43.835961],
        [-22.667039, -43.841976], [-22.665428, -43.849001], [-22.669383, -43.855656],
        [-22.6656, -43.863693], [-22.663811, -43.885183], [-22.638445, -43.899084],
        [-22.616523, -43.93148], [-22.602495, -43.936043], [-22.599367, -43.941023],
        [-22.598778, -43.951977], [-22.58357, -43.960917], [-22.582525, -43.973452],
        [-22.577314, -43.98359], [-22.586001, -44.011315], [-22.585992, -44.016486],
        [-22.58087, -44.022965], [-22.582227, -44.038967], [-22.585798, -44.055767],
        [-22.592785, -44.070179], [-22.587351, -44.088183], [-22.589791, -44.104199],
        [-22.576506, -44.114702], [-22.570849, -44.115561], [-22.568096, -44.121386],
        [-22.560427, -44.122356], [-22.556202, -44.128495], [-22.561876, -44.144491],
        [-22.562319, -44.170856], [-22.55445, -44.173732], [-22.552056, -44.181618],
        [-22.546115, -44.184221], [-22.543788, -44.189842], [-22.535475, -44.195887],
        [-22.527883, -44.196583], [-22.514279, -44.20962], [-22.512143, -44.216563],
        [-22.487196, -44.246814], [-22.486766, -44.254285], [-22.475863, -44.265355],
        [-22.472797, -44.276519], [-22.453635, -44.295975], [-22.449255, -44.321445],
        [-22.460319, -44.450332], [-22.465585, -44.451502], [-22.467518, -44.447991],
        [-22.462403, -44.447387], [-22.460327, -44.450249], [-22.459631, -44.459638],
        [-22.468188, -44.51209], [-22.489106, -44.55342], [-22.504633, -44.59468],
        [-22.504169, -44.625484], [-22.492276, -44.65511], [-22.499449, -44.663471],
        [-22.523587, -44.719653], [-22.524568, -44.733713], [-22.536067, -44.763492],
        [-22.536837, -44.773096], [-22.544321, -44.785748], [-22.541951, -44.79976],
        [-22.56011, -44.828835], [-22.55704, -44.853985], [-22.563315, -44.864931],
        [-22.573624, -44.865562], [-22.578307, -44.876726], [-22.584246, -44.87823],
        [-22.590491, -44.88613], [-22.599949, -44.888678], [-22.623694, -44.910213],
        [-22.641497, -44.946588], [-22.657687, -44.963776], [-22.661982, -44.98035],
        [-22.670816, -44.994882], [-22.79321, -45.164238], [-22.818612, -45.182893],
        [-22.823107, -45.19206], [-22.822176, -45.201686], [-22.838371, -45.223408],
        [-22.848697, -45.227548], [-22.846761, -45.231397], [-22.859469, -45.234219],
        [-22.871387, -45.24639], [-22.877058, -45.271713], [-22.904394, -45.309889],
        [-23.007786, -45.515455], [-23.037833, -45.558931], [-23.048552, -45.597329],
        [-23.061659, -45.62525], [-23.075663, -45.652638], [-23.111305, -45.704985],
        [-23.191924, -45.865061], [-23.184251, -45.886728], [-23.184826, -45.884173],
        [-23.189909, -45.882565], [-23.203006, -45.888228], [-23.212188, -45.900357],
        [-23.221517, -45.902652], [-23.241577, -45.923519], [-23.298976, -46.011939],
        [-23.307099, -46.041507], [-23.308031, -46.055821], [-23.313984, -46.067062],
        [-23.32092, -46.092635], [-23.322596, -46.118103], [-23.348239, -46.169373],
        [-23.352286, -46.181976], [-23.351937, -46.198911], [-23.359223, -46.216554],
        [-23.397436, -46.293675], [-23.403117, -46.329389], [-23.409021, -46.341033],
        [-23.424696, -46.40154], [-23.47259, -46.520475], [-23.504294, -46.568126],
        [-23.529236, -46.591227], [-23.522329, -46.602994], [-23.521929, -46.611747],
        [-23.51384, -46.621182], [-23.513379, -46.625187], [-23.516303, -46.625264]
      ]
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
        progress: 37.15,
        distanceFromOrigin: 160,
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
        progress: 60.34,
        distanceFromOrigin: 259,
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
        progress: 78.99,
        distanceFromOrigin: 340,
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
