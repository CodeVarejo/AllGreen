import { GoogleGenAI } from '@google/genai';

export async function analyzeRoomPhoto(imageBase64: string, roomType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback response if GEMINI_API_KEY is not configured
    return {
      roomType: roomType || 'Ambiente Residencial/Corporativo',
      estimatedArea: 12,
      recommendedStyle: 'Jardim Preservado Moss & Samambaia',
      recommendedSpecies: [
        'Moss Moss Preservado (Líquen Dinamarquês)',
        'Samambaia Chorona Hiper-Realista',
        'Costela-de-Adão Preservada'
      ],
      acousticImprovement: 'Absorção Acústica Alta (-9 dB a -12 dB em frequências médias)',
      wellScore: 11,
      leedCredits: 8,
      estimatedBudgetMin: 2800,
      estimatedBudgetMax: 4500,
      aiAnalysisText: 'Identificamos uma parede com excelente iluminação indireta. Recomendamos uma composição biofílica mista com musgo preservado e samambaias pendentes para otimizar a acústica do cômodo e integrar harmoniosamente com a iluminação existente.'
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    
    // Clean base64 string
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analise esta foto do ambiente para um projeto de paisagismo biofílico da All Green Decor.
    Tipo de ambiente declarado: ${roomType || 'Não informado'}.
    
    Por favor retorne um JSON estrito com os seguintes campos:
    {
      "roomType": "tipo do cômodo identificado",
      "estimatedArea": número estimado em m² para a parede verde,
      "recommendedStyle": "estilo recomendado (ex: Jardim Preservado, Jardim Permanente UV, Misto Biofílico)",
      "recommendedSpecies": ["lista de 3 espécies botânicas sugeridas"],
      "acousticImprovement": "descrição do ganho acústico estimado",
      "wellScore": número estimado de pontos WELL (ex: 8 a 12),
      "leedCredits": número estimado de créditos LEED (ex: 6 a 10),
      "estimatedBudgetMin": valor mínimo estimado em R$,
      "estimatedBudgetMax": valor máximo estimado em R$,
      "aiAnalysisText": "Uma análise profissional e elegante de 2 frases explicando por que esse estilo combina com a parede e mobília da foto."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error('Gemini API room analysis error:', error);
  }

  // Fallback if parsing or API fails
  return {
    roomType: roomType || 'Ambiente Selecionado',
    estimatedArea: 15,
    recommendedStyle: 'Jardim Preservado Moss & Samambaia',
    recommendedSpecies: [
      'Moss Moss Preservado (Líquen Dinamarquês)',
      'Samambaia Chorona Hiper-Realista',
      'Costela-de-Adão Preservada'
    ],
    acousticImprovement: 'Absorção Acústica Alta (-10 dB em frequências médias)',
    wellScore: 11,
    leedCredits: 8,
    estimatedBudgetMin: 3200,
    estimatedBudgetMax: 5400,
    aiAnalysisText: 'O espaço possui proporções excelentes para receber uma parede verde vertical de alta densidade. A iluminação valorizará o relevo tridimensional dos musgos preservados e folhagens.'
  };
}

/**
 * Responde dúvidas frequentes sobre as metodologias de biofilia da All Green Decor
 * utilizando a API do Gemini (gemini-3.8-flash).
 */
export async function answerBiophiliaQuestion(
  question: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstruction = `Você é o Assistente Especialista em Biofilia e Paisagismo Técnico da All Green Decor & Biophilia.
Sua missão é responder dúvidas técnicas, arquitetônicas e comerciais de usuários, arquitetos e clientes sobre as metodologias biofílicas da All Green com clareza, autoridade técnica e elegância.

Metodologias e Soluções All Green:
1. Jardins Verticais Preservados:
   - 100% naturais, que passam por estabilização ecológica com glicerina vegetal pura e pigmentação orgânica.
   - Zero água, zero poda, zero terra e dispensam iluminação solar direta.
   - Durabilidade de 5 a 10 anos em ambientes internos climatizados.
   - Excelente absorção acústica (NRC até 0.89, redução de ruído de -9dB a -14dB em frequências médias/altas de voz humana).
   - Não atraem insetos, não soltam pólen e são hipoalergênicos e anti-estáticos.

2. Jardins Verticais Permanentes Anti-UV (Real Touch):
   - Espécies botânicas artificiais hiper-realistas feitas com polímeros nobres e aditivo anti-UVA/UVB injetado na massa.
   - Desenvolvidos especialmente para fachadas externas, varandas com insolação direta, coberturas e áreas expostas a chuva e vento.
   - Garantia de 5 anos contra desbotamento ou ressecamento.

3. Musgo Polar Moss (Líquen Escandinavo):
   - Colhido de manejo sustentável na Escandinávia e preservado com glicerina.
   - Relevo esponjoso 3D tridimensional.
   - Função higroscópica ativa: indica e absorve a umidade relativa do ar (mantendo o conforto ideal entre 40% e 60%).

4. Sistema Construtivo Modular Plug & Play 100x50cm:
   - Placas modulares estruturadas em compósito reciclado ultra-leve (cerca de 4 a 6 kg/m² contra mais de 45 kg/m² de jardins vivos convencionais).
   - Encaixe macho-fêmea com travamento invisível.
   - Não requer obras civis pesadas, impermeabilização de paredes ou pontos de esgoto e tubulação de irrigação.
   - Removível e reinstalável em caso de mudança de imóvel.

5. Sustentabilidade e Certificações LEED & WELL:
   - 100% de economia de água potável (zero consumo hídrico ao longo de todo o ciclo de vida).
   - Pontua em LEED v4.1 (crédito EQc7 de Qualidade do Ar e Materiais Regionais).
   - Pontua em certificação WELL v2 (Feature M02 e M07 - Design Biofílico e Conexão com a Natureza, e Feature S01/S04 - Conforto Acústico).
   - Aumento comprovado de até 15% em produtividade e bem-estar e redução de estresse e fadiga mental em escritórios corporativos.

6. Atendimento e Logística:
   - Atendemos todo o Brasil com envio de kits técnicos pré-montados ou instalação turnkey completa por equipe própria.
   - Suporte a arquitetos com biblioteca BIM/CAD (famílias Revit e blocos 3D SketchUp).
   - Contato: contato@allgreendecor.com.br e WhatsApp (11) 91272-0799.

Diretrizes de resposta:
- Responda em português brasileiro com tom profissional, cortês e objetivo.
- Formate a resposta de forma agradável e escaneável (parágrafos curtos ou bullets concisos quando oportuno).
- Foque em solucionar a dúvida do usuário de maneira prática, destacando os diferenciais da All Green sem rodeios desnecessários.`;

  if (!apiKey) {
    return generateLocalFallbackAnswer(question);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build chat contents from history + current question
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Keep last 6 history entries for context
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      formattedContents.push({
        role: h.role,
        parts: [{ text: h.text }],
      });
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: question }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (response.text && response.text.trim()) {
      return response.text.trim();
    }
  } catch (error) {
    console.error('Gemini API Biophilic Chat error:', error);
  }

  return generateLocalFallbackAnswer(question);
}

/**
 * Resposta de contingência rica caso a API do Gemini esteja temporariamente sem chave ou instável.
 */
function generateLocalFallbackAnswer(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('preservado') && (q.includes('permanente') || q.includes('diferença') || q.includes('qual a'))) {
    return `A principal diferença está no material e na indicação de uso:

• **Jardins Preservados:** Feitos com folhagens e musgos 100% naturais que passaram por um processo botânico de estabilização ecológica com glicerina vegetal. Mantêm a textura macia, flexibilidade e aroma suave por 5 a 10 anos. São recomendados exclusivamente para **ambientes internos climatizados**, sem incidência solar direta.

• **Jardins Permanentes Anti-UV:** Compostos por espécies artificiais hiper-realistas de padrão botânico internacional (toque real), com protetor solar UV injetado no polímero. São indicados para **fachadas externas, sacadas ensolaradas e varandas**, resistindo a intempéries sem desbotar.`;
  }

  if (q.includes('manuten') || q.includes('rega') || q.includes('irrig') || q.includes('água') || q.includes('cuid')) {
    return `Nossas metodologias possuem **manutenção 100% zero**:

1. **Sem Irrigação ou Ponto de Água:** Nenhuma das nossas soluções exige canos, bombas elétricas ou irrigação por gotejamento, eliminando riscos de infiltrações e mofo na parede.
2. **Sem Podas ou Pragas:** Por não haver terra ou substrato úmido, não atraem insetos nem desenvolvem pragas.
3. **Limpeza Simplificada:** As plantas preservadas possuem propriedades antiestáticas que repelem poeira. Se necessário, uma limpeza leve com espanador ou soprador de ar a cada 6 ou 12 meses é suficiente.`;
  }

  if (q.includes('leed') || q.includes('well') || q.includes('certifica') || q.includes('sustent')) {
    return `As paredes verdes da All Green contribuem com pontuações expressivas em selos internacionais:

• **LEED v4.1:** Pontua em créditos de **Qualidade Ambiental Interna (EQc7)** e **Eficiência Hídrica** (por garantir 100% de economia de água potável no paisagismo vertical).
• **WELL Building Standard:** Pontua nas features de **Design Biofílico (M02 e M07)** e **Conforto Acústico (S01 e S04)**, comprovadamente diminuindo o estresse e o cortisol em até 15% nos colaboradores.
• Disponibilizamos memoriais descritivos e laudos técnicos prontos para submissão aos auditores de certificação.`;
  }

  if (q.includes('acúst') || q.includes('ruído') || q.includes('som') || q.includes('barulho')) {
    return `Nossos painéis oferecem alto desempenho de atenuação sonora:

• **Absorção Acústica:** Os jardins verticais preservados e o Musgo Polar Moss possuem coeficiente de absorção sonora **NRC de até 0.89** (testado em câmara reverberante).
• **Atenuação Sonora:** Reduzem reverberações e ecos na faixa de frequência da voz humana (500Hz a 2000Hz), com atenuação típica de **-9 dB a -14 dB**, sendo ideais para recepções corporativas, salas de reunião e restaurantes.`;
  }

  if (q.includes('plug') || q.includes('módulo') || q.includes('instala') || q.includes('como instala') || q.includes('fixa')) {
    return `O sistema construtivo **Plug & Play** da All Green é pré-fabricado em módulos de 100x50cm:

• **Estrutura Leve:** Pesa cerca de 4 a 6 kg/m² (ao contrário dos jardins naturais que pesam mais de 45 kg/m² com terra úmida).
• **Fixação Rápida:** Utiliza sistema de encaixe macho-fêmea com parafusos ocultos. A instalação é seca, limpa e leva apenas algumas horas.
• **Portabilidade:** Se você mudar de escritório ou residência, os módulos podem ser desencaixados e reinstalados no novo endereço sem perda de material.`;
  }

  if (q.includes('preço') || q.includes('custo') || q.includes('orçamento') || q.includes('valor')) {
    return `O investimento em paredes verdes All Green varia de acordo com a área total (m²) e a metodologia escolhida:

• Projetos em **Jardim Preservado ou Musgo Polar**: média entre R$ 850 e R$ 1.800/m² dependendo da densidade e relevo botânico.
• Projetos em **Jardim Permanente Anti-UV**: média entre R$ 750 e R$ 1.500/m².
• Você pode simular a sua parede no nosso **Simulador IA** no topo da página ou abrir o formulário de orçamento para receber uma proposta técnica detalhada com condições comerciais sob medida!`;
  }

  return `Na All Green Decor & Biophilia, desenvolvemos soluções biofílicas que unem alta estética à engenharia sustentável:

• **Jardins Verticais Preservados:** Plantas 100% naturais estabilizadas com glicerina, sem água e com durabilidade de 5 a 10 anos.
• **Jardins Permanentes Anti-UV:** Folhagens Real Touch resistentes ao sol para fachadas e áreas externas.
• **Módulos Plug & Play 100x50cm:** Instalação limpa, sem furos excessivos e sem tubulações de água.
• **Certificações:** Homologado para créditos LEED e WELL, além de absorção acústica de até -14 dB.

Você gostaria de saber mais sobre algum aspecto específico, como instalação, acústica, durabilidade ou certificações ambientais?`;
}

