const mongoose = require('mongoose')
const adminProduct = require('../models/adminProduct')
const register = require('../models/register')
const checkout = require('../models/checkout');
const address = require('../models/address');
const socket = require('../socket/index');
let emailDetail

// ============================= Admin get product =========================== 

exports.getAll = (async (req, res, next) => {

    try {

        const pageNumber = req.body.paginat
        const email = req.body.email
        const data = {};
        const objectid = await register.find({ email: req.body.email })
        const id = objectid[0]._id
        const totalPosts = await adminProduct.find({ email: email }).countDocuments().exec();
        let startIndex = pageNumber * 9;
        data.totalPosts = totalPosts;
        data.data = await adminProduct.find({ email: email })
            .sort("-_id")
            .skip(startIndex)
            .limit(9)
            .exec();
        res.status(200).json({
            message: "complete",
            data: data,
            id: id,
        })
    }
    catch (error) {
        res.status(404).json({
            message: "complete fail",
        })
    }
});

// ============================= Admin add product =========================== 

exports.add = (async (req, res, next) => {

    try {
        console.log("Check :- ", req.user)

        const check = await register.find({ email: req.body.email })
        req.body.image = req.file.path
        req.body['adminId'] = check[0]._id
        if (check.length != 0) {
            console.log("check ;- ", req.body)
            const a = await adminProduct.create(req.body)
            console.log("Check stock :- ", a)
            const data = await adminProduct.find({ email, email })
            socket.removeProduct('addProduct');
            res.status(200).json({
                message: "complete",
                data: data
            })
        }
        else {
            res.status(200).json({
                message: "complete fail",
            })
        }
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        })
    }
});

// ============================= Admin remove product =========================== 

exports.remove = (async (req, res, next) => {
    try {

        const id = req.body.id
        const email = req.body.email

        await adminProduct.deleteOne({ _id: id })
        await checkout.deleteOne({ productId: id })

        const send = await adminProduct.find({ email: email })
        console.log("========================================================")
        socket.addProduct('removeProduct');

        res.status(200).json({
            message: "complete",
            data: send
        })
    }
    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});

// ============================= Admin detail show =========================== 

exports.detail = (async (req, res, next) => {

    try {
        const check = await register.find({ email: req.body.email })
        if (check[0].type === "user") {

            const id = check[0]._id
            const data = await checkout.find({ userId: id, sellerId: emailDetail }).populate('productId').populate('userId').populate('addressId')
            res.status(200).json({
                message: "complete",
                data: data,
            })
        }
        else {
            emailDetail = check[0]._id
            const id = check[0]._id
            const data = await checkout.find({ sellerId: id }).populate('productId').populate('userId').populate('addressId')
            res.status(200).json({
                message: "complete",
                data: data,
            })
        }
    }

    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});

// ============================= Admin update show =========================== 

exports.update = (async (req, res, next) => {

    try {
        const id = req.body.id
        const a = await adminProduct.updateOne({ _id: req.body.id }, { productName: req.body.productName, price: req.body.price })
        const data = await adminProduct.find({ _id: req.body.id })
        socket.updateProduct('updateProduct', data);
        res.status(200).json({
            message: "complete",
        })
    }
    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});

// ============================= Admin Order show =========================== 

exports.order = (async (req, res, next) => {
    try {
        const data = await address.find({ _id: req.body.email })
        res.status(200).json({
            message: "complete",
            data: data,
        })
    }
    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});

// ============================= Admin status update show =========================== 


exports.status = (async (req, res, next) => {
    try {
        const id = req.body.id
        const status = req.body.status

        if (status === 'conform') {
            await checkout.updateOne({ _id: id }, { status: 'Conform' })
            socket.conformOrder('conformOrder');
        }
        else {

            const a = await checkout.find({ _id: id }).populate('addressId')
            await checkout.deleteOne({ _id: id })
            const check = a[0].addressId._id
            const b = await checkout.find({ addressId: check })

            if (b.length === 0) {
                await address.deleteOne({ _id: check })
            }
        }
        res.status(200).json({
            message: "complete",
        })
    }
    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});

// ============================= search added product =========================== 

exports.search = (async (req, res, next) => {
    try {
        const Data = {}
        const pageNumber = req.body.paginat
        const message = req.body.message
        const email = req.body.email
        const totalPosts = await adminProduct.find({ productName: message, email: email }).countDocuments().exec();
        let startIndex = pageNumber * 9;
        Data.totalPosts = totalPosts;
        Data.data = await adminProduct.find({ productName: message, email: email })
            .sort("-_id")
            .skip(startIndex)
            .limit(9)
            .exec();
        res.status(200).json({
            message: "complete",
            data: Data
        })
    }
    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});