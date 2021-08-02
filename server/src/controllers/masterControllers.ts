import { Request, Response } from 'express';
import { MasterModel } from '../models/Master';
import { OrderModel } from '../models/Order';
import { validationResult } from 'express-validator';

export async function postMaster(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Incorrect request', errors });
    }
    try {
        const { name, rating, city } = req.body;
        const master = await MasterModel.create({ name, rating, city });
        const returnMaster = await MasterModel.findById(master._id).populate({ path: 'city', select: 'city_name' });
        return res.json(returnMaster);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function getMaster(req: Request, res: Response) {
    try {
        const master = await MasterModel.find().populate({ path: 'city', select: 'city_name' });
        return res.json(master);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function updateMaster(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Incorrect request', errors });
    }
    try {
        const master = req.body;
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'ID not found' });
        }
        await MasterModel.findByIdAndUpdate(id, master, { new: true });
        const returnMaster = await MasterModel.findById(id).populate({ path: 'city', select: 'city_name' });
        return res.json(returnMaster);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function deleteMaster(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Incorrect request', errors });
    }
    try {
        const { id } = req.params;
        const master: any = await MasterModel.findByIdAndDelete(id);

        const allMasterOrders = master.order;
        for (let i = 0; i < allMasterOrders.length; i++) {
            await OrderModel.findByIdAndDelete(allMasterOrders[i]);
        }
        return res.json(master);
    } catch (e) {
        res.status(500).json(e);
    }
}
