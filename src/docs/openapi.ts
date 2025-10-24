import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Utility Management System API',
      version: '1.0.0',
      description:
        'Comprehensive API documentation for the Utility Management System',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Tenants',
        description: 'Tenant management endpoints',
      },
      {
        name: 'Occupants',
        description: 'Occupant management endpoints',
      },
      {
        name: 'Customer Services',
        description: 'Customer service request endpoints',
      },
      {
        name: 'Rooms',
        description: 'Room management endpoints',
      },
      {
        name: 'Contracts',
        description: 'Contract management endpoints',
      },
      {
        name: 'Contract Types',
        description: 'Contract type management endpoints',
      },
      {
        name: 'Bills',
        description: 'Bill management endpoints',
      },
      {
        name: 'Invoices',
        description: 'Invoice management endpoints',
      },
      {
        name: 'Receipts',
        description: 'Receipt management endpoints',
      },
      {
        name: 'Total Units',
        description: 'Utility units management endpoints',
      },
    ],
  },
  apis: [
    './src/docs/schemas/*.ts', // All schema files
    './src/docs/responses/*.ts', // All responses files
    './src/docs/components/*.ts', // All component files
    './src/routes/*.ts', // All route files
  ],
};

const swaggerSpec = swaggerJsdoc(options);

// Function to validate and debug the OpenAPI spec
function validateOpenAPISpec(spec: any) {
  console.log('=== OpenAPI Spec Validation ===');
  console.log('Components available:', Object.keys(spec.components || {}));
  console.log(
    'Schemas available:',
    Object.keys(spec.components?.schemas || {})
  );
  console.log(
    'Parameters available:',
    Object.keys(spec.components?.parameters || {})
  );
  console.log(
    'Responses available:',
    Object.keys(spec.components?.responses || {})
  );
  console.log(
    'RequestBodies available:',
    Object.keys(spec.components?.requestBodies || {})
  );
  console.log(
    'Tags defined:',
    spec.tags?.map((tag: any) => tag.name)
  );
  console.log('================================');
}

export const setupSwagger = (app: Express, port: number = 3000): void => {
  // validateOpenAPISpec(swaggerSpec);

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Utility Management System API Docs',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    })
  );
  console.log(`📚 API Docs: http://localhost:${port}/docs`);
};
