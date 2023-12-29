const express = require("express");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../Schemas/userSchema");
const router = express.Router();
dotenv.config();

router.post("/register", async(req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    });
    try {
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.post("/login", async(req, res) => {
    try {
    const user = await User.findOne({email: req.body.email});

    if(user) {
        const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if(originalPassword === req.body.password) {
            const token = jwt.sign({
                userId: user._id,
                isAdmin: user.isAdmin,}, 
                process.env.SECRET_KEY,
                { expiresIn: "5d" }
            );
            const {password, ...info} = user._doc;
            res.status(200).json({...info, token});
        } else {
            res.status(401).json("wrong email or password");
        }
    } else {
        res.status(401).json("wrong email or password");
    }
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;