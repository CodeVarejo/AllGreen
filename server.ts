import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { analyzeRoomPhoto } from './src/services/gemini';
import { PROJECT_SAMPLES } from './src/data/mockData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'All Green Decor & Biophilia' });
  });

  // Consult project by code (e.g. AG-4891)
  app.get('/api/project-code/:code', (req, res) => {
    const code = req.params.code?.toUpperCase();
    const project = PROJECT_SAMPLES.find(
      (p) => p.code.toUpperCase() === code || p.id.toUpperCase() === code
    );

    if (project) {
      res.json({ success: true, project });
    } else {
      res.status(404).json({
        success: false,
        message: `Projeto com o código ${code} não foi encontrado. Tente códigos cadastrados como AG-4891, AG-2024, AG-3090, AG-5112.`
      });
    }
  });

  // AI Wall Simulator route
  app.post('/api/simulate', async (req, res) => {
    try {
      const { imageBase64, roomType } = req.body;
      const result = await analyzeRoomPhoto(imageBase64 || '', roomType || '');
      res.json({ success: true, result });
    } catch (error: any) {
      console.error('Error simulating wall:', error);
      res.status(500).json({ success: false, message: 'Erro ao processar simulação de ambiente.' });
    }
  });

  // Executive Quote Request submit endpoint
  app.post('/api/quote', (req, res) => {
    const { name, email, phone, city, roomArea, projectType, message } = req.body;
    
    // Generate confirmation ticket code
    const ticketCode = `AG-${Math.floor(1000 + Math.random() * 9000)}`;

    res.json({
      success: true,
      ticketCode,
      message: `Orçamento solicitado com sucesso! O código da sua proposta é ${ticketCode}. Um consultor biofílico entrará em contato em até 24h.`
    });
  });

  // Newsletter subscription
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    res.json({
      success: true,
      message: `E-mail ${email} cadastrado com sucesso no Clube de Tendências Biofílicas All Green!`
    });
  });

  // Vite development middleware vs production static distribution
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server All Green running on http://localhost:${PORT}`);
  });
}

startServer();
