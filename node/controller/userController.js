const mongoose = require('mongoose')
const adminProduct = require('../models/adminProduct')
const checkout = require('../models/checkout')
const register = require('../models/register')
const address = require('../models/address')

// ============================= getall data show =========================== 

exports.getAll = ('/user', async (req, res, next) => {

    const email = req.body.email

    const id = await register.find({ email: email })
    const pageNumber = req.body.pageNumber;
    const result = {};
    const totalPosts = await adminProduct.countDocuments().exec();
    let startIndex = pageNumber * 9;
    result.totalPosts = totalPosts;
    result.data = await adminProduct.find()
        .sort("-_id")
        .skip(startIndex)
        .limit(9)
        .exec();
    try {
        res.status(200).json({
            message: "complete",
            data: result,
            id: id[0]._id
        })
    }
    catch (error) {
        res.status(404).json({
            message: "complete fail",
        })
    }


});

// ============================= Cart data show =========================== 

exports.userCart = ('/user/cart', async (req, res, next) => {

    try {
        res.status(200).json({
            message: "complete",
            data: req.data
        })
    }
    catch (error) {
        res.status(404).json({
            message: "complete fail",
        })
    }
});

// ============================= data checkout =========================== 

exports.checkout = ('/user/checkout', async (req, res, next) => {
    var userEmail = req.body[1]
    let check = await register.find({ email: userEmail })
    userId = check[0]._id

    try {
        var data = req.body[0]
        // data.map(async (product) => {
        //     const { quantity, _id, adminId, price, fullName, house, area, city, pincode } = product.cardData
        //     const id = await address.create({
        //         fullName: fullName,
        //         house: house,
        //         area: area,
        //         city: city,
        //         pincode: pincode
        //     })
        //     await checkout.create({
        //         quantity: quantity,
        //         price: price,
        //         productId: _id,
        //         userId: userId,
        //         sellerId: adminId,
        //         addressId: id._id,
        //         status: "Pending"
        //     })
        // })

        res.status(200).json({
            message: "complete",
        })
    }
    catch (error) {
        res.status(404).json({
            message: "complete fail",
        })
    }
});

// ============================= user detail show =========================== 


exports.detail = ('/user/detail', async (req, res, next) => {

    const id = await register.find({ email: req.body.email })
    const find = id[0]._id
    const data = await checkout.find({ userId: find }).populate('productId').populate('addressId').populate('userId')

    try {

        res.status(200).json({
            message: "complete",
            data: data
        })
    }
    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});

// ============================= user order show =========================== 

exports.order = ('/user/order', async (req, res, next) => {
    try {
        const data = await address.find({ _id: req.body.email })
        console.log("Data :- ", data)
        res.status(200).json({
            message: "complete",
            data: data
        })
    }
    catch (error) {
        res.status(404).json({
            message: "fail",
        })
    }
});


// ============================= user order update =========================== 

exports.orderUpdate = ('/user/orderupdate', async (req, res, next) => {
    try {
        await address.updateOne({ _id: req.body.id }, { fullName: req.body.fullName, house: req.body.house, area: req.body.area, city: req.body.city, pincode: req.body.pincode })
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