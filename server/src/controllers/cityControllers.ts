import { Request, Response } from 'express';
import { CityModel } from '../models/City.js';
import { MasterModel } from '../models/Master.js';
import { OrderModel } from '../models/Order.js';
import { validationResult } from 'express-validator';

export async function postCity(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Incorrect request', errors });
    }
    try {
        const { city_name } = req.body;
        const city = await CityModel.create({ city_name });
        res.json(city);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function getCity(req: Request, res: Response) {
    try {
        const city = await CityModel.find();
        return res.json(city);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function updateCity(req: Request, res: Response) {
    try {
        const city = req.body;
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'ID not found' });
        }
        const updatedCity = await CityModel.findByIdAndUpdate(id, city, { new: true });
        return res.json(updatedCity);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function deleteCity(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'ID not found' });
        }
        const city = await CityModel.findByIdAndDelete(id);

        let masterWithCity = await MasterModel.find({ city: id }).exec();

        for (let i = 0; i < masterWithCity.length; i++) {
            const masterWithCityOrders = masterWithCity[i].order;

            for (let i = 0; i < masterWithCityOrders.length; i++) {
                // @ts-ignore
                const masterOrders = masterWithCityOrders[i]._id;
                await OrderModel.findByIdAndDelete(masterOrders);
            }
            await MasterModel.findByIdAndDelete(masterWithCity[i]._id);
        }

        return res.json(city);
    } catch (e) {
        console.log(e);
    }
}
