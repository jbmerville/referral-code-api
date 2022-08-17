import YAML from 'yamljs';
import cors from 'cors';
import express from 'express';
import getReferralHandler from '@handlers/getReferralHandler';
import { https } from 'firebase-functions/v2';
import { logger } from 'firebase-functions/v2';
import path from 'path';
import putReferralHandler from '@handlers/putReferralHandler';
import swaggerUi from 'swagger-ui-express';
const swagger_path = path.resolve(__dirname, './openapi.yaml');
const swaggerDocument = YAML.load(swagger_path);

const app = express();
// cors({ origin: true });
// app.use(cors);

const loggingMiddleWare = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const oldJson = res.json;
  res.json = (body: any): any => {
    logger.log(`Starting request with query: ${JSON.stringify(req.query)}, body: ${JSON.stringify(req.body)}`);
    res.locals.body = body;
    logger.log(`Finishing with response: ${JSON.stringify(body)}`);
    return oldJson.call(res, body);
  };
  next();
};

app.use(loggingMiddleWare);

app.get('/referral', async (req, res) => {
  logger.log(`Received GET /referral`);
  await getReferralHandler(req, res);
});

app.put('/referral', async (req, res) => {
  logger.log(`Received PUT /referral`);
  await putReferralHandler(req, res);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

exports.api = https.onRequest({ timeoutSeconds: 60, memory: '512MiB' }, app);
