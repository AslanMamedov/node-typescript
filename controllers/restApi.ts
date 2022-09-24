import { Request, Response, NextFunction } from 'express';

import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const dbFolderPath = path.dirname(__dirname) + '/db';
const jsonFilePath = dbFolderPath + '/db.json';

interface IBody {
	readonly id: string;
	[key: string]: any;
}

export const getAll = (req: Request, res: Response, next: NextFunction): void => {
	if (fs.existsSync(dbFolderPath)) {
		fs.readFile(jsonFilePath, 'utf8', (error, data): void => {
			if (error) {
				throw new Error(error.message);
			} else {
				res.send(JSON.parse(data)).status(200);
			}
		});
	} else {
		res.json({ message: 'DB is empty' }).status(204);
	}
};

export const getOne = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
	if (fs.existsSync(dbFolderPath)) {
		fs.readFile(jsonFilePath, 'utf8', (error, data): void => {
			if (error) {
				throw new Error(error.message);
			} else {
				const dataParce: IBody[] = JSON.parse(data);
				const dataId = dataParce.find((data) => data.id === req.params.id.slice(1)) as IBody;

				res.json(dataId).status(200);
			}
		});
	} else {
		res.json({ message: 'DB is empty' }).status(204);
	}
};

export const create = (req: Request, res: Response, next: NextFunction): void => {
	const jsonData = req.body;
	const data: IBody = { id: uuid() };
	const arr: IBody[] = [];
	arr.push({ ...data, ...jsonData });
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
				const parceData: IBody[] = JSON.parse(data);
				parceData.push(...arr);
				fs.writeFile(jsonFilePath, JSON.stringify([...parceData], null, 4), (error): void => {
					if (error) throw new Error(error.message);
				});
			});
		}
	});

	res.json({ message: 'Success! Data was added' }).status(201);
};

export const updateOne = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
	if (fs.existsSync(dbFolderPath)) {
		fs.readFile(jsonFilePath, 'utf8', (error, data) => {
			if (error) throw new Error(error.message);
			const dataParce: IBody[] = JSON.parse(data);
			const dataId = dataParce.find((data) => data.id === req.params.id.slice(1)) as IBody;

			const newData: IBody[] = dataParce.filter((data) => data.id !== req.params.id.slice(1));
			fs.writeFile(
				jsonFilePath,
				JSON.stringify([...[...newData, { ...dataId, ...req.body }]], null, 4),
				(error) => {
					if (error) throw new Error(error.message);
					res.send('Success! Data was changed').status(200);
				}
			);
		});
	} else {
		res.json({ message: 'DB is empty' }).status(204);
	}
};


export const deleteOne = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
	if (fs.existsSync(dbFolderPath)) {
		fs.readFile(jsonFilePath, 'utf8', (error, data) => {
			if (error) throw new Error(error.message);
			const dataParce: IBody[] = JSON.parse(data);
			const newData: IBody[] = dataParce.filter((data) => data.id !== req.params.id.slice(1));
			fs.writeFile(jsonFilePath, JSON.stringify([...newData], null, 4), (error) => {
				if (error) throw new Error(error.message);
				res.send('Success! Data was deleted').status(410);
			});
		});
	} else {
		res.json({ message: ' is empty' }).status(204);
	}
}