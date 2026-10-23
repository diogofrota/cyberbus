<div align="center">
  <h1>CyberBus</h1>
  <p><strong>Sua viagem, sempre por perto.</strong></p>
  <p>Um protótipo interativo para acompanhar uma viagem rodoviária do embarque à chegada.</p>
</div>

> [!NOTE]
> Este projeto é uma **demonstração**. A viagem, a posição do ônibus, os horários, o clima e os dados de atendimento são simulados. Nenhuma localização real é coletada.

## O que você encontra

| Momento | Recursos disponíveis |
| --- | --- |
| **Antes da partida** | Identificação do ônibus, placa e foto; plataforma de embarque; mapa interno da rodoviária. |
| **Durante a viagem** | Mapa do trajeto, posição simulada do ônibus, próximas paradas, estabelecimentos, link de acompanhamento e informações de emergência. |
| **Depois da chegada** | Resumo da viagem, clima ilustrativo no destino, roteiros em São Paulo e avaliação. |

A interface se adapta à etapa da viagem: **“Meu ônibus” e “Encontrar plataforma” aparecem durante o embarque e saem da navegação quando o trajeto começa**.

## Teste em poucos passos

É preciso ter **Python 3** para servir os arquivos localmente. Para usar os atalhos abaixo, tenha também **Node.js e npm**. Não há pacotes para instalar.

```bash
git clone https://github.com/diogofrota/cyberbus.git
cd cyberbus
npm run dev
```

Abra **http://localhost:4173** e informe o localizador **`BR1024`**. Também é possível tocar no código de exemplo para preencher o campo.

Sem npm, inicie o servidor com `python3 -m http.server 4173` na raiz do projeto.

### Como funciona a simulação

| Etapa | Duração | O que acontece |
| --- | ---: | --- |
| Preparação do embarque | 1 minuto | O ônibus fica no terminal; você pode conferir a foto e encontrar a plataforma 12. |
| Viagem | 100 segundos | O ônibus avança pela rota simulada; os acessos de embarque desaparecem. |
| Chegada | 1 minuto | O resumo e a avaliação ficam disponíveis. |
| Novo ciclo | Automático | A demonstração volta à preparação do embarque. |

Uma nova consulta pelo localizador reinicia o minuto de embarque. O tempo restante não aparece como cronômetro na interface.

## Páginas e recursos

- **Minha viagem:** reúne os acessos relevantes para cada etapa e mostra o estado atual do trajeto.
- **Ônibus e rodoviária:** trazem a identificação do veículo e um mapa interno em SVG até a plataforma.
- **Rota e acompanhamento público:** exibem o trajeto em mapa interativo e uma posição de GPS simulada.
- **Paradas e serviços:** mostram horários, detalhes dos pontos de apoio e estabelecimentos demonstrativos.
- **Compartilhamento:** permite copiar um link para a página pública de acompanhamento.
- **Chegada:** apresenta clima ilustrativo, roteiros turísticos e avaliação da experiência.

O percurso demonstrativo vai da **Rodoviária Novo Rio, no Rio de Janeiro, ao Terminal Rodoviário Tietê, em São Paulo**.

## Estrutura do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` e demais páginas `.html` | Telas do protótipo multipágina. |
| `css/` | Estilos globais, componentes e ajustes responsivos. |
| `js/data.js` | Dados fixos da viagem, do ônibus, das paradas e da simulação. |
| `js/simulation.js` | Fases, avanço da viagem e persistência local da sessão. |
| `js/app.js` | Navegação compartilhada, ícones, alertas e utilitários da interface. |
| `js/real-map.js` | Mapa interativo usado na rota e no acompanhamento. |
| `assets/images/` | Imagens locais do ônibus, serviços e roteiros. |
| `scripts/` | Validação das páginas e geração da versão estática. |
| `dist/` | Arquivos prontos para hospedagem estática. |

O projeto usa **HTML, CSS e JavaScript sem framework**. Os mapas de rota usam **Leaflet 1.9.4** e mapas base do **OpenStreetMap**; a geometria do trajeto demonstrativo está nos dados locais. O mapa interno da rodoviária é um SVG do próprio projeto.

## Validar e gerar a versão estática

```bash
python3 scripts/validate_site.py
npm run build
```

A validação confere as 15 páginas HTML, metadados, identificadores e referências locais. O build copia páginas, estilos, scripts e imagens para `dist/`. A configuração de hospedagem em `.openai/hosting.json` usa essa pasta.

## Limites da demonstração

- Não há backend, banco de dados, autenticação, GPS real ou consulta de clima em tempo real.
- A sessão da simulação e a avaliação são guardadas no `localStorage` do navegador.
- Os botões de WhatsApp e e-mail demonstram a ação na interface; o envio de mensagens não é realizado pelo protótipo.
- O mapa interativo precisa de internet para carregar o Leaflet e os mapas base. O mapa interno em SVG é local.
- As informações de emergência são ilustrativas e não acionam um serviço de atendimento.

Os créditos e as licenças das fotos dos roteiros aparecem nas respectivas páginas do aplicativo.
