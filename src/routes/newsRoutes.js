const express=require('express');
const router = new express.Router();

const auth=require('../middleware/authMiddleware');
const{createNews,getallnews,getNewsbyId,toggleFeaturedNews,updateNews,deleteNewsById,getFeaturedhomenews,getNewsbySlug}=require('../controllers/newsController');

router.post('/',auth,createNews);
router.get('/',auth,getallnews);
router.get('/listnews',getallnews);
router.get('/slug/:slug', getNewsbySlug);
router.get('/:id',auth,getNewsbyId);
router.get('/home/featured-news', getFeaturedhomenews);
router.patch('/:id/toggle-featured', auth, toggleFeaturedNews);
router.put('/:id',auth,updateNews);
router.delete('/:id',auth,deleteNewsById);


module.exports = router;