
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const verifyRecaptcha = require('../middleware/recaptchaMiddleware');
const {createContact,getContacts,getContactById,deleteContact}=require('../controllers/contactController');

router.post('/',verifyRecaptcha,createContact);

router.get('/', auth, getContacts);

router.get('/:id',auth,getContactById);

router.delete('/:id',auth,deleteContact);

module.exports = router;