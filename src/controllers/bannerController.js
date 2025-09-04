const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

// Configure multer storage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'images', 'banners');
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
        cb(null, `banner-${uniqueSuffix}${fileExtension}`);
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

const uploadMiddleware = upload.single('BannerImage');

// Helper function to delete an image file from the disk
const deleteImage = async (imagePath) => {
    try {
        if (imagePath && imagePath.startsWith('/images/banners/')) {
            const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
            await fs.unlink(fullPath);
        }
    } catch (err) {
        console.error('Error deleting image file:', err.message);
    }
};

// Create banner
const createBanner = async (req, res) => {
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        const BannerImage = req.file ? `/images/banners/${req.file.filename}` : null;

        try {
            if (!BannerImage) {
                if (req.file) await fs.unlink(req.file.path);
                return res.status(400).json({ msg: 'Banner image is required.' });
            }

            const newBanner = await prisma.tbl_banner.create({
                data: { BannerImage },
            });

            res.status(201).json({ msg: 'Banner created successfully.', banner: newBanner });
        } catch (err) {
            if (req.file) await fs.unlink(req.file.path);
            console.error('Create banner error:', err.message);
            res.status(500).send('Server Error during banner creation');
        }
    });
};

// Get all banners
const getAllBanners = async (req, res) => {
    try {
        const banners = await prisma.tbl_banner.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(banners);
    } catch (err) {
        console.error('Get banners error:', err.message);
        res.status(500).send('Server Error');
    }
};

// Get banner by ID
const getBannerById = async (req, res) => {
    const { id } = req.params;
    try {
        const banner = await prisma.tbl_banner.findUnique({
            where: { BannerID: id },
        });

        if (!banner) {
            return res.status(404).json({ msg: 'Banner not found.' });
        }
        res.json(banner);
    } catch (err) {
        console.error('Get banner by ID error:', err.message);
        res.status(500).send('Server Error');
    }
};

// Update banner
const updateBanner = async (req, res) => {
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        const { id } = req.params;
        const newImagePath = req.file ? `/images/banners/${req.file.filename}` : null;

        try {
            const existingBanner = await prisma.tbl_banner.findUnique({
                where: { BannerID: id },
                select: { BannerImage: true },
            });

            if (!existingBanner) {
                if (req.file) await fs.unlink(req.file.path);
                return res.status(404).json({ msg: 'Banner not found for updating.' });
            }

            const imageToStore = newImagePath || existingBanner.BannerImage;

            const updatedBanner = await prisma.tbl_banner.update({
                where: { BannerID: id },
                data: { BannerImage: imageToStore },
            });

            if (newImagePath && existingBanner.BannerImage) {
                await deleteImage(existingBanner.BannerImage);
            }

            res.json({ msg: 'Banner updated successfully', banner: updatedBanner });
        } catch (err) {
            if (req.file) await fs.unlink(req.file.path);
            if (err.code === 'P2025') {
                return res.status(404).json({ msg: 'Banner not found for updating.' });
            }
            console.error('Update banner error:', err.message);
            res.status(500).send('Server Error during banner update');
        }
    });
};

// Delete banner
const deleteBannerById = async (req, res) => {
    const { id } = req.params;
    try {
        const bannerToDelete = await prisma.tbl_banner.findUnique({
            where: { BannerID: id },
            select: { BannerImage: true },
        });

        if (!bannerToDelete) {
            return res.status(404).json({ msg: 'Banner not found for deletion.' });
        }

        await prisma.tbl_banner.delete({
            where: { BannerID: id },
        });

        await deleteImage(bannerToDelete.BannerImage);

        res.json({ msg: 'Banner deleted successfully.' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ msg: 'Banner not found for deletion.' });
        }
        console.error('Delete banner error:', err.message);
        res.status(500).send('Server Error during banner deletion');
    }
};

module.exports = { createBanner, getAllBanners, getBannerById, updateBanner, deleteBannerById };
