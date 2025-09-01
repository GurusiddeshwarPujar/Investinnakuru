const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {Createnewslettersubscriber,getallnewsletter,deletenewsletter}=require('../controllers/newslettersubscriber');

router.post('/',Createnewslettersubscriber);
router.get('/', auth, getallnewsletter);
router.delete('/:id',auth,deletenewsletter);

module.exports = router;