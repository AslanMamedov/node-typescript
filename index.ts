import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import restApiRoutes from './routes/restApiRoutes';

const app: Express = express();
const PORT = process.env.PORT || 5000;


morgan(':method :url :status :res[content-length] - :response-time ms');

app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
		// optionsSuccessStatus: 200,
		// allowedHeaders: true
	})
);
// app.use(
// 	session({
// 		secret: 'google',
// 		resave: false,
// 		saveUninitialized: true,
// 	})
// );
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));


app.use('/api', restApiRoutes);

(async () => {
	try {
		app.listen(PORT, () => {
			console.log(`Server was started on the http://localhost:${PORT}`);
		});
	} catch (error: unknown) {
		throw new Error();
	}
})();
