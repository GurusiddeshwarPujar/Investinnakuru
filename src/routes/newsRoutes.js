const express=require('express');
const router = new express.Router();

const auth=require('../middleware/authMiddleware');
const{createNews,getallnews,getNewsbyId,updateNews,deleteNewsById}=require('../controllers/newsController');

router.post('/',auth,createNews);
router.get('/',auth,getallnews);
router.get('/:id',auth,getNewsbyId);
router.put('/:id',auth,updateNews);
router.delete('/:id',auth,deleteNewsById);


module.exports = router;