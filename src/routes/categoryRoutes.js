const express =require('express');
const router=express.Router();
const auth=require('../middleware/authMiddleware');
const {createCategory,getallCategory,updateCategory,deleteCategory}=require('../controllers/categoryController');



router.post('/',auth,createCategory);
router.get('/',auth,getallCategory);
router.get('/listkeysector',getallCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id',auth,deleteCategory);

module.exports = router;