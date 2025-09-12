const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

// Configure multer storage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'images', 'news');
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
        cb(null, `news-${uniqueSuffix}${fileExtension}`);
    }
});

// Configure multer upload middleware
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

// Helper function to delete an image file from the disk
const deleteImage = async (imagePath) => {
    try {
        if (imagePath && imagePath.startsWith('/images/news/')) {
            const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
            await fs.unlink(fullPath);
        }
    } catch (err) {
        console.error('Error deleting image file:', err.message);
    }
};

const createNews = async (req, res) => {
    // Wrap the entire logic in a try-catch block to handle file-related errors
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        const { CatId, NewsTitle, NewsURL, NewsDescription ,NewsShortDescription} = req.body;
        const Image = req.file ? req.file.filename : null;

        try {
            if (!CatId || !NewsTitle || !NewsURL || !NewsDescription || !Image || !NewsShortDescription) {
                // If the file was uploaded but a field is missing, delete the file
                if (req.file) {
                    await fs.unlink(req.file.path);
                }
                return res.status(400).json({ msg: 'All news fields are required.' });
            }

            const newNews = await prisma.tbl_news.create({
                data: { CatId, NewsTitle, NewsURL, NewsDescription, Image,NewsShortDescription },
            });

            res.status(201).json({ msg: 'News article created successfully.', news: newNews });
        } catch (err) {
            // Delete uploaded file if a Prisma error occurs
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            if (err.code === 'P2002' && err.meta?.target.includes('NewsTitle')) {
                return res.status(409).json({ msg: 'A news article with that news title already exists.' });
            }
            console.error('Create news error:', err.message);
            res.status(500).send('Server Error during news creation');
        }
    });
};

const getallnews = async (req, res) => {
    try {
        const news = await prisma.tbl_news.findMany({
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
        res.json(news);
    } catch (err) {
        console.error('Get news error:', err.message);
        res.status(500).send('Server Error');
    }
};

const getNewsbyId = async (req, res) => {
    const { id } = req.params;
    try {
        const news = await prisma.tbl_news.findUnique({
            where: { NewsId: id },
            include: { category: true },
        });

        if (!news) {
            return res.status(404).json({ msg: 'News article not found.' });
        }
        res.json(news);
    } catch (err) {
        console.error('Get news by ID error:', err.message);
        res.status(500).send('Server Error');
    }
};

const updateNews = async (req, res) => {
    // Use the upload middleware
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        const { id } = req.params;
        const { CatId, NewsTitle, NewsURL, NewsDescription ,NewsShortDescription } = req.body;
        const newImagePath = req.file ? req.file.filename : null;

        try {
            const existingNews = await prisma.tbl_news.findUnique({
                where: { NewsId: id },
                select: { Image: true },
            });

            if (!existingNews) {
                if (req.file) await fs.unlink(req.file.path);
                return res.status(404).json({ msg: 'News article not found for updating.' });
            }

            const imageToStore = newImagePath || existingNews.Image;

            const updatedNews = await prisma.tbl_news.update({
                where: { NewsId: id },
                data: { CatId, NewsTitle, NewsURL, NewsDescription, Image: imageToStore,NewsShortDescription },
            });

            // If a new image was uploaded, delete the old one
            if (newImagePath && existingNews.Image) {
                await deleteImage(existingNews.Image);
            }

            res.json({ msg: 'News article updated successfully', news: updatedNews });
        } catch (err) {
            if (req.file) await fs.unlink(req.file.path);
            if (err.code === 'P2025') {
                return res.status(404).json({ msg: 'News article not found for updating.' });
            }
            if (err.code === 'P2002' && err.meta?.target.includes('NewsTitle')) {
                return res.status(409).json({ msg: 'A news article with that news title already exists.' });
            }
            console.error('Update news error:', err.message);
            res.status(500).send('Server Error during news update');
        }
    });
};

const deleteNewsById = async (req, res) => {
    const { id } = req.params;
    try {
        const newsToDelete = await prisma.tbl_news.findUnique({
            where: { NewsId: id },
            select: { Image: true },
        });

        if (!newsToDelete) {
            return res.status(404).json({ msg: 'News article not found for deletion.' });
        }

        await prisma.tbl_news.delete({
            where: { NewsId: id },
        });

        await deleteImage(newsToDelete.Image);

        res.json({ msg: 'News article deleted successfully.' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ msg: 'News article not found for deletion.' });
        }
        console.error('Delete news error:', err.message);
        res.status(500).send('Server Error during news article deletion');
    }
};

module.exports = { createNews, getallnews, getNewsbyId, updateNews, deleteNewsById };