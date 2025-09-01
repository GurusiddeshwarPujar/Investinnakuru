const express = require('express');
const router = new express.Router();

const {getallnews,getNewsbyId}=require('../controllers/newsController');


router.get('/',getallnews);

router.get('/:id',getNewsbyId);

module.exports = router;

