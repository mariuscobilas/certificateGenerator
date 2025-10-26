# Setup Instructions for Certificate Generator

## What Was Changed

### Frontend Changes (Already Done)
1. **Created `/frontend/api/upload.ts`** - API functions to communicate with backend
2. **Updated `/frontend/app/upload/page.tsx`** - Now sends files to backend instead of localStorage
3. **Updated `/frontend/app/certificate/page.tsx`** - Reads filenames from session storage
4. Files are now uploaded to `http://localhost:3001/api/upload/`

### Backend Changes (Need to Install)
1. **Created `/backend/routes/upload.js`** - Handles file uploads
2. **Updated `/backend/app.js`** - Added CORS and upload routes
3. **Updated `/backend/package.json`** - Added multer and cors dependencies

## Next Steps for You

### 1. Install Backend Dependencies
Open your terminal and run:
```bash
cd backend
npm install
```

This will install the new dependencies (cors and multer) that were added to package.json.

### 2. Start the Backend Server
Make sure your backend is running on port 3001:
```bash
cd backend
npm start
```

You should see: "Server running on port 3001" or similar.

### 3. Start the Frontend (if not running)
In a separate terminal:
```bash
cd frontend
npm run dev
```

### 4. Test the Application
1. Open `http://localhost:3000` in your browser
2. Go to the upload page
3. Upload a CSV file - it will be saved to `backend/uploads/`
4. Upload a PDF file - it will be saved to `backend/uploads/`
5. Continue to the certificate configuration page

## How It Works Now

1. **User uploads CSV** → Frontend sends to `http://localhost:3001/api/upload/csv`
2. **Backend saves CSV** → Stores it in `backend/uploads/` with a timestamp
3. **Backend responds** → Returns filename to frontend
4. **User uploads PDF** → Frontend sends to `http://localhost:3001/api/upload/certificate`
5. **Backend saves PDF** → Stores it in `backend/uploads/` with a timestamp
6. **Backend responds** → Returns filename to frontend
7. **User clicks Continue** → Filenames are stored in sessionStorage
8. **Next page loads** → Reads filenames from sessionStorage for certificate generation

## File Structure After Running

```
backend/
  ├── uploads/                    (created automatically)
  │   ├── 1234567890-list.csv
  │   └── 1234567891-certificate.pdf
  ├── routes/
  │   └── upload.js               (created)
  ├── app.js                      (updated)
  └── package.json                (updated)
```

## API Endpoints

Your backend now has these endpoints:

- `POST /api/upload/csv` - Upload CSV file
- `POST /api/upload/certificate` - Upload PDF certificate template

Both return JSON like:
```json
{
  "success": true,
  "filename": "1234567890-file.csv",
  "path": "/path/to/backend/uploads/1234567890-file.csv",
  "size": 1234
}
```

## Troubleshooting

**If files don't upload:**
- Check that backend is running on port 3001
- Check browser console for CORS errors
- Check backend terminal for error messages

**If you see CORS errors:**
- Make sure cors dependency is installed
- Make sure `app.use(cors())` is in your app.js (it is now)

**If files aren't being saved:**
- Check that `backend/uploads/` folder exists
- The folder is created automatically when the server starts

