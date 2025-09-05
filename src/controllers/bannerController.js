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
        // We will store only this filename in the database.
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

// Helper function to delete an image file from the disk.
// This function now expects just the filename, not the full path.
const deleteImage = async (filename) => {
    try {
        if (filename) {
            // Construct the full path using the filename
            const fullPath = path.join(__dirname, '..', '..', 'public', 'images', 'banners', filename);
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
            // If multer returns an error, it is a bad request
            return res.status(400).json({ msg: err.message });
        }

        // We now store only the filename in the database
        const BannerImage = req.file ? req.file.filename : null;

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
            // If a database error occurs, clean up the uploaded file
            if (req.file) await fs.unlink(req.file.path);
            console.error('Create banner error:', err.message);
            res.status(500).send('Server Error during banner creation');
        }
    });
};

// Get all banners
// No changes here, the client will need to construct the full image URL
// using the filename returned by this endpoint.
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
// No changes here, the client will need to construct the full image URL
// using the filename returned by this endpoint.
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
        // We now get only the new filename, if a file was uploaded.
        const newImageName = req.file ? req.file.filename : null;

        try {
            const existingBanner = await prisma.tbl_banner.findUnique({
                where: { BannerID: id },
                select: { BannerImage: true },
            });

            if (!existingBanner) {
                // If the banner doesn't exist, we must clean up the newly uploaded file.
                if (req.file) await fs.unlink(req.file.path);
                return res.status(404).json({ msg: 'Banner not found for updating.' });
            }

            // Decide which image name to store in the database. If a new one was uploaded, use it.
            // Otherwise, keep the existing one.
            const imageToStore = newImageName || existingBanner.BannerImage;

            const updatedBanner = await prisma.tbl_banner.update({
                where: { BannerID: id },
                data: { BannerImage: imageToStore },
            });

            // If a new image was uploaded and there was an existing one, delete the old one.
            if (newImageName && existingBanner.BannerImage) {
                await deleteImage(existingBanner.BannerImage);
            }

            res.json({ msg: 'Banner updated successfully', banner: updatedBanner });
        } catch (err) {
            // Clean up the new file on database error
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

        // Now we can safely call deleteImage with the filename from the database.
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
