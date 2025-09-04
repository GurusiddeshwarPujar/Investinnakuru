const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const { 
   creatEvent,getallevents,getEventByID,updateEvent,deleteEventByID,toggleFeatured,getTopFeaturedEvents
} = require('../controllers/eventsController');


router.post('/', auth, creatEvent);


router.get('/', auth, getallevents);


router.get('/:id', auth, getEventByID);


router.get('/featured', getTopFeaturedEvents);


router.put('/:id', auth, updateEvent);


router.put('/toggle-featured/:id', auth, toggleFeatured);


router.delete('/:id', auth, deleteEventByID);

module.exports = router;

