import { Router } from 'express';
const router = Router();

import { getAll, getOne, create, updateOne, deleteOne } from '../controllers/restApi';

router.get('/', getAll);

router.get('/:id', getOne);

router.post('/', create);

router.patch('/:id', updateOne);

router.delete('/:id', deleteOne);

export default router;
