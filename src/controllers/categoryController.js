const {PrismaClient}=require("../../generated/prisma");
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');


const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'images', 'keysector');
        try {
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (err) {
            console.error('Error creating upload directory:', err);
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `keysector-${uniqueSuffix}${fileExtension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPG, PNG, and WEBP images are allowed.'));
        }
        cb(null, true);
    }
});

const uploadMiddleware = upload.single('Image');

const deleteImage = async (imagePath) => {
    try {
        if (imagePath && imagePath.startsWith('/images/keysector/')) {
            const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
            await fs.unlink(fullPath);
        }
    } catch (err) {
        console.error('Error deleting image file:', err.message);
    }
};


const createCategory=async (req,res)=>{
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        const {CatName,CatURL}=req.body;
        const Image = req.file ? req.file.filename : null;
        try{
            if(!CatName || !CatURL || !Image){
                if (req.file) {
                    await fs.unlink(req.file.path);
                }
                return res.status(400).json({msg:'Key sector name and URL are required.'});
            }

            const newCategory= await prisma.tbl_category.create({
                data:{CatName,CatURL,Image},
            });
            res.status(201).json({msg:'Key sector created successfully',category : newCategory });

        }catch(err){
            if (req.file) {
                 await fs.unlink(req.file.path);
            }
            if (err.code === 'P2002' && err.meta?.target.includes('CatName')) {
                return res.status(409).json({ msg: 'A key sector with that name already exists.' });
            }
                console.error('Create key sector error:', err.message);
                res.status(500).send('Server Error during key sector creation');
        }   
    });

};

const getallCategory =async (req,res)=>{
    try{
        const categories= await prisma.tbl_category.findMany({
            orderBy:{createdAt:'desc'},
        });
        res.json(categories);
    }catch(err){
        console.error('Get key sector error:',err.message);
        res.status(500).send('Server Error');
    }
};


const updateCategory= async (req,res)=>{
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        const {id} = req.params;
        const { CatName, CatURL } = req.body;
         const newImagePath = req.file ? req.file.filename : null;
        try{

            const existingCategory = await prisma.tbl_category.findUnique({
                            where: { CatId: id },
                            select: { Image: true },
            });
            
            if (!existingCategory) {
                if (req.file) await fs.unlink(req.file.path);
                return res.status(404).json({ msg: 'Key sector article not found for updating.' });
            }
            
            const imageToStore = newImagePath || existingCategory.Image;


            const updatedCategory = await prisma.tbl_category.update({
                where :{CatId :id},
                data:{
                    CatName,CatURL,Image :imageToStore,
                },
            });

             if (newImagePath && existingCategory.Image) {
                await deleteImage(existingCategory.Image);
            }

            res.json({msg:'Key sector updated sucessfully.',category :updatedCategory});
        }catch(err){
             if (req.file) await fs.unlink(req.file.path);
            if (err.code === 'P2025') {
                return res.status(404).json({ msg: 'Key sector not found for updating.' });
            }
            if (err.code === 'P2002' && err.meta?.target.includes('CatName')) {
                return res.status(409).json({ msg: 'A key sector with that name already exists.' });
            }
            console.error('Update key sector error:', err.message);
            res.status(500).send('Server Error during key sector update');
        }
    });
};


const deleteCategory=async (req,res)=>{
    const {id}=req.params;
    try{
        const catgeoryToDelete = await prisma.tbl_category.findUnique({
            where: { CatId: id },
            select: { Image: true },
        });

        if (!catgeoryToDelete) {
            return res.status(404).json({ msg: 'Key sector not found for deletion.' });
        }

        await prisma.tbl_category.delete({
            where :{CatId:id},
        });

        await deleteImage(catgeoryToDelete.Image);
        res.json({msg :'Key sector deleted successfully'});
    }catch(err){
        if(err.code === 'P2025'){
            return res.status(404).json({ msg: 'Key sector not found for deletion.' });
        }
        console.error('Delete key sector error:', err.message);
        res.status(500).send('Server Error during key sector deletion');
    }
};



module.exports={createCategory,getallCategory,updateCategory,deleteCategory};