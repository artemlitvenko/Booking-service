import { Router } from 'express';
const router = Router();
import { postCity, getCity, updateCity, deleteCity } from '../controllers/cityControllers';
import { cityValidators } from '../service/validators';

router.post('', cityValidators, postCity);
router.get('', getCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

export { router };
