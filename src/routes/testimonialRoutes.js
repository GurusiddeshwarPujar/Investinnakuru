const express = require('express');
const router = express.Router(); 

const auth = require('../middleware/authMiddleware');

const {createTestimonial,getalltestimonal,gettestimonalbyId,updateTestimonal,getFeaturedhomeTestimonal,deleteTestimonalById,toggleFeatured} =require('../controllers/testimonialsController');

router.post('/',auth,createTestimonial);

router.put('/:id',auth,updateTestimonal);

router.get('/',auth,getalltestimonal);

router.get('/list',getalltestimonal);

router.get('/:id',auth, gettestimonalbyId);
router.get('/home/featured-successstories', getFeaturedhomeTestimonal);

router.put('/toggle-featured/:id', auth, toggleFeatured);

router.delete('/:id',auth,deleteTestimonalById);

module.exports = router;