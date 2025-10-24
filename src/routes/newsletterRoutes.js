const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const verifyRecaptcha = require('../middleware/recaptchaMiddleware');
const {Createnewslettersubscriber,getallnewsletter,deleteManyNewsletters}=require('../controllers/newslettersubscriber');

router.post('/',verifyRecaptcha,Createnewslettersubscriber);
router.get('/', auth, getallnewsletter);
// router.delete('/:id',auth,deletenewsletter);
router.delete('/', auth, deleteManyNewsletters);
module.exports = router;