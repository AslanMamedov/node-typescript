import { Router, Request, Response, NextFunction } from 'express';
const router = Router();
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const dbFolderPath = path.dirname(__dirname) + '/db';
const jsonFilePath = dbFolderPath + '/db.json';

interface IBody {
	id: string;
	[key: string]: any;
}

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
	const jsonData: IBody = req.body;
	jsonData['id'] = uuid();

	const arr: IBody[] = [];
	arr.push(jsonData);
	if (!fs.existsSync(dbFolderPath)) {
		fs.mkdir(dbFolderPath, (error): void => {
			if (error) throw new Error(error.message);
		});
	}
	if (!fs.existsSync(jsonFilePath)) fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2), 'utf8');

	fs.access(jsonFilePath, (error) => {
		if (!error) {
			fs.readFile(jsonFilePath, 'utf8', (error, data): void => {
				if (error) throw new Error(error.message);
				const parceData: any[] = JSON.parse(data);
				parceData.push(...arr);
				fs.writeFile(jsonFilePath, JSON.stringify([...parceData], null, 4), (error): void => {
					if (error) throw new Error(error.message);
				});
			});
		}
	});

	res.json({ message: 'Done' }).status(201);
});

export default router;
