const {PrismaClient} = require('../../generated/prisma');
const prisma = new PrismaClient();

const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const { json } = require('stream/consumers');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'images', 'testimonial');
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
        cb(null, `testimonial-${uniqueSuffix}${fileExtension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
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
        if (imagePath && imagePath.startsWith('/images/testimonial/')) {
            const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
            await fs.unlink(fullPath);
        }
    } catch (err) {
        console.error('Error deleting image file:', err.message);
    }
};


const createTestimonial = async (req,res)=>{
    uploadMiddleware(req,res,async (err)=>{
        if(err){
            return res.status(400).json({msg : err.message});
        }

        const {TFullName,designation,testimonial}=req.body;

        const Image = req.file ? req.file.filename : null;

        try{
            if(!TFullName || !designation || !testimonial){

                if(req.file){
                    await fs.unlink(req.file.path);
                }
                return res.status(400).json({msg : 'All testimonial fields are required.'});
            }

            const newTestimonial = await prisma.tbl_testimonial.create({
                data: { TFullName, designation, testimonial, Image },
            });


            res.status(201).json({msg : 'Testimonial successfully created.' , testimonial: newTestimonial});
        }catch(err){
            if(req.file){
                await fs.unlink(req.file.path);
            }
            console.error('Create testimonal error:', err.message);
            res.status(500).json({msg :'Server Error during testimonal creation'});
        }
    });

};


const getalltestimonal = async(req,res)=>{
    try{
        const _testimonal =await prisma.tbl_testimonial.findMany({
            orderBy : {createdAt : 'desc'},
        });

        res.json(_testimonal);

    }catch(err){
        console.error('Get testimonal error:', err.message);
        res.status(500).json({msg :'Server Error'});
    }
};


const gettestimonalbyId =async(req,res)=>{
    const { id } = req.params;


    try{
        const _testimonalbyID=await prisma.tbl_testimonial.findUnique({
            where : {TID :id},
        });

       res.json(_testimonalbyID);

    }catch(err){
            console.error('Get testimonal by ID error:', err.message);
            res.status(500).json({msg :'Server Error'});
    }
};

const updateTestimonal =async (req,res)=>{
    uploadMiddleware(req,res,async (err)=>{
         if(err){
            return res.status(400).json({msg : err.message});
        }

        const {id}=req.params;
        const {TFullName,designation,testimonial}=req.body;
        const newImagePath = req.file ? req.file.filename : null;

        try{
            const existingtestimonal = await prisma.tbl_testimonial.findUnique({
                where : {TID :id},
                select :{Image : true},
            });

            if(!existingtestimonal){
                 if (req.file) await fs.unlink(req.file.path);
                 return res.status(404).json({ msg: 'Testimonal not found for updating.' });
            }

             const imageToStore = newImagePath || existingtestimonal.Image;
              const updatedtestimonal = await prisma.tbl_testimonial.update({
                where: { TID: id },
                data: { TFullName,designation,testimonial,Image :imageToStore },
            });

            if (newImagePath && existingtestimonal.Image) {
                await deleteImage(existingtestimonal.Image);
            }
             res.json({ msg: 'Testimonal updated successfully', sucessStories: updatedtestimonal });
        }catch(err){
             if (req.file) await fs.unlink(req.file.path);
              if (err.code === 'P2025') {
                return res.status(404).json({ msg: 'Testimonal not found for updating.' });
            }
            console.error('update testimonal error:', err.message);
            res.status(500).json({msg :'Server Error'});
        }

    });
};


const deleteTestimonalById = async (req, res) => {
    const { id } = req.params;
    try {
        const testimonalToDelete = await prisma.tbl_testimonial.findUnique({
            where: { TID: id },
            select: { Image: true },
        });

        if (!testimonalToDelete) {
            return res.status(404).json({ msg: 'Testimonal not found for deletion.' });
        }

        await prisma.tbl_testimonial.delete({
            where: { TID: id },
        });

        await deleteImage(testimonalToDelete.Image);

        res.json({ msg: 'Testimonal deleted successfully.' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ msg: 'Testimonal not found for deletion.' });
        }
        console.error('Delete testimonal error:', err.message);
        res.status(500).send('Server Error during testimonal deletion');
    }
};


const toggleFeatured = async (req, res) => {
    const { id } = req.params;

    try {
        const existingtestimonials = await prisma.tbl_testimonial.findUnique({
            where: { TID: id },
            select: { Featured: true },
        });

        if (!existingtestimonials) {
            return res.status(404).json({ msg: 'Testimonials not found for toggling.' });
        }
        
        const updatedTestimonals = await prisma.tbl_testimonial.update({
            where: { TID: id },
            data: {
                Featured: !existingtestimonials.Featured,
            },
        });

        res.json({ msg: 'Testimonial featured status toggled successfully.', testimonials : updatedTestimonals });
    } catch (err) {
        console.error('Toggle featured status error:', err.message);
        res.status(500).send('Server Error during testimonal deletion');
    }
};



module.exports = {createTestimonial,getalltestimonal,gettestimonalbyId,updateTestimonal,deleteTestimonalById,toggleFeatured};