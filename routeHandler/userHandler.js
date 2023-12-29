const express = require("express");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const User = require("../Schemas/userSchema");
const checkLogin = require("../middlewares/checkLogin");
const router = express.Router();
dotenv.config();

router.put('/:id', checkLogin, async(req, res) => {
    if(req.userId === req.params.id || req.isAdmin) {
        if(req.body.password) {
                req.body.password = CryptoJS.AES.encrypt(
                    req.body.password,
                    process.env.SECRET_KEY).toString();
        }
        
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
            res.status(200).json(user);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only update your account");
    }
});

router.delete('/:id', checkLogin, async(req, res) => {
    if(req.userId === req.params.id || req.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only delete your account");
    }
});

router.get("/find/:id", async(req, res) => {
    try {
    const user = await User.findById(req.params.id);
    const {password, ...info} = user;
    res.status(200).json(info);
    } catch(err) {
    res.status(500).json(err);
    }
});

router.get("/", checkLogin, async(req, res) => {
    const query = req.query.new;
    if(req.isAdmin) {
        try {
            const users = query ? await User.find().sort({ _id: -1}).limit(5) : await User.find();
            res.status(200). json(users);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to see all users!");
    }
});

router.get("/stats", async(req, res) => {
    try {
        const data = await User.aggregate([
          {
            $project: {
              month: { $month: "$createdAt" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ]);
        res.status(200).json(data)
      } catch (err) {
        res.status(500).json(err);
      }    
});

module.exports = router;