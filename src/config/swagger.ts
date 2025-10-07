import { Express, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const swaggerPath = path.join(__dirname, '../../swagger.yaml');

function swaggerDocs(app: Express, port: number | string) {
  // Serve Swagger UI
  app.use(
    '/docs',
    swaggerUi.serve, // loading Swagger UI
    (req: Request, res: Response, next: NextFunction) => {
      const swaggerDocument = YAML.load(swaggerPath); // the documentation code

      const swaggerUiOptions = {
        swaggerOptions: {
          withCredentials: true, // This enables sending cookies
          requestInterceptor: (request: any) => {
            // Ensure credentials are included in all requests
            request.credentials = 'include';
            return request;
          },
        },
      };

      return swaggerUi.setup(swaggerDocument, swaggerUiOptions)(req, res, next);
    }
  );

  // Serve Swagger Json (Optional)
  app.get('/docs.json', (_req: Request, res: Response) => {
    const swaggerDocument = YAML.load(swaggerPath);
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
