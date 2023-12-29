const express = require("express");
const List = require("../Schemas/listSchema");
const checkLogin = require("../middlewares/checkLogin");
const router = express.Router();

router.post("/", checkLogin, async(req, res) => {
    if(req.isAdmin) {
        const newList = new List(req.body);
        try {
            const list = await newList.save();
            res.status(200).json(list);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to see all users!");
    }
});

router.delete("/:id", checkLogin, async(req, res) => {
    if(req.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json("List deleted successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to see all users!");
    }
});

router.get("/", checkLogin, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
      if (typeQuery) {
        if (genreQuery) {
          list = await List.aggregate([
            { $sample: { size: 10 } },
            { $match: { type: typeQuery, genre: genreQuery } },
          ]);
        } else {
          list = await List.aggregate([
            { $sample: { size: 10 } },
            { $match: { type: typeQuery } },
          ]);
        }
      } else {
        list = await List.aggregate([{ $sample: { size: 10 } }]);
      }
      res.status(200).json(list);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;