import { Router } from 'express';
const router = Router();
import { getMasterForOrder, postOrder, getOrder, updateOrder, deleteOrder } from '../controllers/orderControllers';
import { orderValidators } from '../service/validators';

router.get('/master', getMasterForOrder);
router.post('', orderValidators, postOrder);
router.get('', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export { router };
