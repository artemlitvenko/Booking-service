import { Router } from 'express';
const router = Router();
import { registrationAuth, loginAuth, googleLogin, authAuth } from '../controllers/authControllers';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerValidators, loginValidators } from '../service/validators';

router.post('/registration', registerValidators, registrationAuth);
router.post('/login', loginValidators, loginAuth);
router.post('/googleLogin', googleLogin);
// @ts-ignore
router.get('/auth', authMiddleware, authAuth);

export { router };
