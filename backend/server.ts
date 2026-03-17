import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import db from './src/models/index';
import authRoutes from './src/routes/auth.routes';
import usuarioRoutes from './src/routes/usuario.routes';
import livroRoutes from './src/routes/livro.routes';
import emprestimoRoutes from './src/routes/emprestimo.routes';
import devolucaoRoutes from './src/routes/devolucao.routes';
import multaRoutes from './src/routes/multa.routes';
import relatorioRoutes from './src/routes/relatorio.routes';

const app: Application = express();

const corsOptions = {
  
};

app.use(cors(corsOptions));
app.use(express.json()); // Recebendo informações usando JSON
app.use(express.urlencoded({ extended: true })); // Recebendo informações de formulários

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Bem vindo ao Sistema de Biblioteca' });
});

// Rotas
authRoutes(app);
usuarioRoutes(app);
livroRoutes(app);
emprestimoRoutes(app);
devolucaoRoutes(app);
multaRoutes(app);
relatorioRoutes(app);

const PORT = process.env.PORT || 4567;

(async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log('Banco de dados sincronizado');
    
    app.listen(PORT, () => {
      console.log(`Aplicação rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.log('Erro ao sincronizar banco de dados:', error);
  }
})();
