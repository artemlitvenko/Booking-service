import { Router } from 'express';
const router = Router();
import { postMaster, getMaster, updateMaster, deleteMaster } from '../controllers/masterControllers';
import { masterPostValidators } from '../service/validators';
import { masterDeleteValidators } from '../service/validators';
import { masterEditValidators } from '../service/validators';

router.post('', masterPostValidators, postMaster);
router.get('', getMaster);
router.put('/:id', masterEditValidators, updateMaster);
router.delete('/:id', masterDeleteValidators, deleteMaster);

export { router };
