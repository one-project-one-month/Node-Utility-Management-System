import { Express, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const swaggerPath = path.join(__dirname, '../../swagger.yaml');

function swaggerDocs(app: Express, port: number | string) {
  app.use('/docs', swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
    const swaggerDocument = YAML.load(swaggerPath);
    return swaggerUi.setup(swaggerDocument)(req, res, next);
  });

  app.get('/docs.json', (_req: Request, res: Response) => {
    const swaggerDocument = YAML.load(swaggerPath);
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
