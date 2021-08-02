import { Router } from 'express';
const router = Router();
import { getClients, updateClient, deleteClient } from '../controllers/clientControllers';

router.get('', getClients);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export { router };
