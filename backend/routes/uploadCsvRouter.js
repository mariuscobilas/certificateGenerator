const express = require('express');
const multer = require('multer');
const path = require('path'); // <-- MISSING IMPORT
const {PDFDocument} = require('pdf-lib')
const fs = require('fs');
const fsPromises = require('fs').promises;
const router = express.Router();

// Ensure upload directories exist
const csvDir = path.join(__dirname, '../uploads/csv');
const certDir = path.join(__dirname, '../uploads/certificate');
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true });
}
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
}

// Storage for CSV files
const csvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/csv');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const uploadCsv = multer({
    storage: csvStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Storage for Certificate files
const certificateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/certificate');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const uploadCertificate = multer({
    storage: certificateStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

function clearDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) return;

        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            fs.unlinkSync(path.join(dirPath, file));
        }

        console.log(`✅ Cleared directory: ${dirPath}`);
    } catch (error) {
        console.error(`❌ Error clearing directory ${dirPath}:`, error);
    }
}

// CSV Upload Route
router.post('/csv', (req, res) => {
    const dir = path.join(__dirname, '../uploads/csv');
    clearDirectory(dir);

    uploadCsv.single('csv')(req, res, (err) => {
        if (err) {
            console.error('CSV upload error:', err);
            return res.status(400).json({
                success: false,
                error: err.message || 'File upload failed'
            });
        }

        const file = req.file;
        console.log('Uploaded CSV file:', file);

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            size: file.size
        });
    });
});

// Certificate Upload Route
router.post('/certificate', (req, res) => {
    const dir = path.join(__dirname, '../uploads/certificate');
    clearDirectory(dir);
    // Note: The callback function is now 'async'
    uploadCertificate.single('certificate')(req, res, async (err) => {
        if (err) {
            console.error('Certificate upload error:', err);
            return res.status(400).json({
                success: false,
                error: err.message || 'File upload failed'
            });
        }

        const file = req.file;
        console.log('Uploaded Certificate file:', file);

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        try {
            if (file.mimetype === 'application/pdf') {
                console.log('File is a PDF. Processing first page...');

                // 1. Read the uploaded file data
                const originalPdfBytes = await fsPromises.readFile(file.path);

                // 2. Load the PDF
                const pdfDoc = await PDFDocument.load(originalPdfBytes);

                if (pdfDoc.getPageCount() > 0) {
                    // 3. Create a new document
                    const newPdfDoc = await PDFDocument.create();

                    // 4. Copy the first page (index 0) from the original to the new doc
                    const [firstPage] = await newPdfDoc.copyPages(pdfDoc, [0]);
                    newPdfDoc.addPage(firstPage);

                    // 5. Save the new, single-page PDF
                    const newPdfBytes = await newPdfDoc.save();

                    // 6. Overwrite the original uploaded file with the new one
                    await fsPromises.writeFile(file.path, newPdfBytes);

                    // 7. Update the file size for the response
                    file.size = newPdfBytes.length;
                    console.log('Successfully extracted first page. New size:', file.size);
                } else {
                    console.warn('PDF file has no pages. Leaving as is.');
                }
            } else {
                console.log('File is not a PDF, skipping page extraction.');
            }
            // Send success response (now with updated size if it was a PDF)
            res.json({
                success: true,
                filename: file.filename,
                originalname: file.originalname,
                path: file.path,
                size: file.size
            });

        } catch (processingError) {
            console.error('Error processing file:', processingError);

            // Clean up the broken/corrupt file
            try {
                // Use the original 'fs' sync method or 'fsPromises'
                await fsPromises.unlink(file.path);
            } catch (unlinkErr) {
                console.error('Failed to unlink corrupted file:', unlinkErr);
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to process the uploaded file. It might be corrupt.'
            });
        }
    });
});

// GET all uploaded CSV files
router.get('/csv', (req, res) => {
    fs.readdir(csvDir, (err, files) => {
        if (err) {
            console.error('Error reading CSV directory:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to read CSV files'
            });
        }
        res.json({
            success: true,
            files: files
        });
    });
});

// GET all uploaded Certificate files
router.get('/certificate', (req, res) => {
    fs.readdir(certDir, (err, files) => {
        if (err) {
            console.error('Error reading certificate directory:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to read Certificate files'
            });
        }
        res.json({
            success: true,
            files: files
        });
    });
});

// GET a specific CSV file by name
router.get('/csv/:filename', (req, res) => {
    const filePath = path.join(csvDir, req.params.filename);
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error sending CSV file:', err);
            res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }
    });
});

// GET a specific Certificate file by name
router.get('/certificate/:filename', (req, res) => {
    const filePath = path.join(certDir, req.params.filename);
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error sending certificate file:', err);
            res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }
    });
});

module.exports = router;