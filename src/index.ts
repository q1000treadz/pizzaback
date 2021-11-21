import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import Routes from './routes/routes';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const PORT = 3000;
const routes : Routes = new Routes();
routes.routes(app);

app.listen(PORT, () => {
  console.info('Express server listening on http://localhost:3000');
});
