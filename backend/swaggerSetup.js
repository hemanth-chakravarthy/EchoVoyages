import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EchoVoyages API',
      version: '1.0.0',
      description: 'API documentation for the EchoVoyages travel booking platform',
      contact: {
        name: 'EchoVoyages Support',
        email: 'support@echovoyages.com'
      }
    },
    servers: [
      {
        url: 'https://echovoyages.onrender.com',
        description: 'Development server'
      }
    ]
  },
  // Path to the API docs
  apis: [
    join(__dirname, './routes/*.js'),
    join(__dirname, './models/*.js')
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger docs available at /api-docs');
};

export default swaggerDocs;
