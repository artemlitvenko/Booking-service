import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MasterModel } from '../models/Master';
import { OrderModel } from '../models/Order';
import { ClientModel } from '../models/Client';
import { mailer } from '../service/nodemailer';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment as any);

export async function getMasterForOrder(req: Request, res: Response) {
    let orderCity: any = req.query.orderCity;
    let startDate: any = req.query.startDate;
    let endDate: any = req.query.endDate;

    try {
        const master = await MasterModel.find().populate('order');

        const masters: any = master.filter((city: any) => {
            return city.city._id == orderCity;
        });

        let mastersResultList = [];

        let clientDay = moment(startDate).format('YYYY MM DD');

        for (let i = 0; i < masters.length; i++) {
            let orders = masters[i].order;
            let isBusy = false;

            for (let ii = 0; ii < orders.length; ii++) {
                let ordersStartTime = orders[ii].start_time;
                let ordersEndTime = orders[ii].end_time;
                let clientStartTime = new Date(startDate);
                let ordersStartTimeShort = moment(ordersStartTime).format('YYYY MM DD');
                let oldOrder: any = [moment(+ordersStartTime), moment(+ordersEndTime)];
                let newOrder: any = [moment(+clientStartTime), moment(+endDate)];

                let range1 = moment.range(newOrder);
                let range2 = moment.range(oldOrder);

                if (clientDay !== ordersStartTimeShort) {
                    isBusy = false;
                } else if (range1.overlaps(range2)) {
                    isBusy = true;
                    break;
                }
            }
            if (!isBusy) {
                const masterList = await MasterModel.find({ _id: masters[i]._id });
                mastersResultList.push(masterList);
            }
        }
        // @ts-ignore
        let mastersReadyList = mastersResultList.flat();
        return res.json(mastersReadyList);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function postOrder(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Incorrect request', errors });
    }
    try {
        const { client_name, client_email, master, city, size, start_time, end_time } = req.body;
        let clientCreate = await ClientModel.findOne({ client_email: client_email }).exec();
        if (!clientCreate) {
            clientCreate = await ClientModel.create({ client_name, client_email });
        }
        let client = clientCreate._id;
        const order = await OrderModel.create({ master, client, city, size, start_time, end_time });
        res.json(order);
        let orderId = order._id;

        let currentClient: any = await ClientModel.findById(client);
        let currentClientOrder = currentClient?.client_order;
        currentClientOrder.push(orderId);
        let addOrderIdToClient = { client_order: currentClientOrder };
        await ClientModel.findByIdAndUpdate(client, addOrderIdToClient, { new: true });

        let currentMaster = await MasterModel.findById(master);
        let currentMasterOrder: any = currentMaster?.order;
        currentMasterOrder.push(orderId);
        let addOrderIdToMaster = { order: currentMasterOrder };
        await MasterModel.findByIdAndUpdate(master, addOrderIdToMaster, { new: true });

        const message = {
            to: req.body.client_email,
            subject: 'Thank you! Your order has been successfully received!',
            text: `We will contact you shortly at the email address (${req.body.client_email}) you provided to clarify your order.`,
        };
        mailer(message);
    } catch (e) {
        console.log(e);
    }
}

export async function getOrder(req: Request, res: Response) {
    try {
        const order = await OrderModel.find().populate({ path: 'master', select: 'name' }).populate({ path: 'client' });
        return res.json(order);
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function updateOrder(req: Request, res: Response) {
    try {
        const { master, client_name, client_email, city, size, start_time, end_time } = req.body.body;

        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'ID not found' });
        }
        let order: any = await OrderModel.findById(id);
        let clientId = order.client._id;
        let clientData = { client_name: client_name, client_email: client_email };
        await ClientModel.findByIdAndUpdate(clientId, clientData, { new: true });

        let oldMasterId = order.master._id;
        if (!oldMasterId == master) {
            let editOldMaster: any = await MasterModel.findById(oldMasterId);
            let masterAllOrder = editOldMaster.order.filter((deleteId: string) => deleteId != id);
            let addOrderIdToMaster = { order: masterAllOrder };
            await MasterModel.findByIdAndUpdate(oldMasterId, addOrderIdToMaster, { new: true });
        }

        let orderData = { start_time: start_time, end_time: end_time, size: size, master: master, city: city };
        const updatedOrder = await OrderModel.findByIdAndUpdate(id, orderData, { new: true });
        return res.json(updatedOrder);
    } catch (e) {
        res.status(500).json(e);
        console.log(e);
    }
}

export async function deleteOrder(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'ID not found' });
        }

        const order = await OrderModel.findByIdAndDelete(id);
        const masterWithCurrentOrder: any = await MasterModel.findOne({ order: id });
        let masterAllOrder = masterWithCurrentOrder.order.filter((deleteId: string) => deleteId != id);
        let masterId = masterWithCurrentOrder._id;
        let addOrderIdToMaster = { order: masterAllOrder };
        await MasterModel.findByIdAndUpdate(masterId, addOrderIdToMaster, { new: true });

        // START Delete orderId in Client

        const clientWithCurrentOrder: any = await ClientModel.findOne({ client_order: id });

        let clientAllOrder = clientWithCurrentOrder.client_order.filter((deleteId: string) => deleteId != id);
        let clientId = clientWithCurrentOrder._id;
        let addOrderIdToClient = { client_order: clientAllOrder };
        await ClientModel.findByIdAndUpdate(clientId, addOrderIdToClient, { new: true });

        // END Delete orderId in Client

        return res.json(order);
    } catch (e) {
        res.status(500).json(e);
    }
}
