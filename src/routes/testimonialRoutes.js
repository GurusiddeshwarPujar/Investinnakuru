const express = require('express');
const router = express.Router(); 

const auth = require('../middleware/authMiddleware');

const {createTestimonial,getalltestimonal,gettestimonalbyId,updateTestimonal,deleteTestimonalById,toggleFeatured} =require('../controllers/testimonialsController');

router.post('/',auth,createTestimonial);

router.put('/:id',auth,updateTestimonal);

router.get('/',auth,getalltestimonal);

router.get('/:id',auth, gettestimonalbyId);

router.put('/toggle-featured/:id', auth, toggleFeatured);

router.delete('/:id',auth,deleteTestimonalById);

module.exports = router;