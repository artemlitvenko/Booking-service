import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { validationResult } from 'express-validator';

const key = config.SECRET_KEY;

export async function registrationAuth(req: Request, res: Response) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Incorrect request', errors });
        }
        const { email, password } = req.body;
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            return res.status(400).json({ message: `User with email ${email} already exist` });
        }
        const hashPassword = await bcrypt.hash(password, 8);
        const user = new UserModel({ email, password: hashPassword });
        await user.save();
        res.json({ message: 'User was created' });
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' });
    }
}

export async function loginAuth(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Incorrect request', errors });
    }
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isPassValid = bcrypt.compareSync(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, `${key}`, { expiresIn: '1h' });
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' });
    }
}
export async function googleLogin(req: Request, res: Response) {
    try {
        const { email, token } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' });
    }
}

export interface IAuthAuthRequest extends Request {
    user: any
}
export async function authAuth(req: IAuthAuthRequest, res: Response) {
    try {
        const user = await UserModel.findOne({ email: req.user.email });
        const token = jwt.sign({ email: user?.email }, `${key}`, { expiresIn: '1h' });
        return res.json({
            token,
            user: {
                id: user?.id,
                email: user?.email,
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: 'Server error' });
    }
}
