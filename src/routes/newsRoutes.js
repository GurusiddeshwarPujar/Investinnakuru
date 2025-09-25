const express=require('express');
const router = new express.Router();

const auth=require('../middleware/authMiddleware');
const{createNews,getallnews,getNewsbyId,updateNews,deleteNewsById,getNewsbySlug}=require('../controllers/newsController');

router.post('/',auth,createNews);
router.get('/',auth,getallnews);
router.get('/listnews',getallnews);
router.get('/slug/:slug', getNewsbySlug);
router.get('/:id',auth,getNewsbyId);
router.put('/:id',auth,updateNews);
router.delete('/:id',auth,deleteNewsById);


module.exports = router;