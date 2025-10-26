# Backend Express Task - Certificate Generator API

## Overview
You need to create Express API endpoints that will receive files from the frontend and save them locally on the server. The frontend will be sending CSV and PDF files to `http://localhost:3001/api`.

## What You Need To Do

### 1. Install Required Packages
Open the backend directory and run these commands:
```bash
cd backend
npm install multer cors
```

### 2. Create Upload Directory
Create a folder called `uploads` in the backend directory:
```
backend/uploads/
```


### 6. Test the Endpoints
Start your Express server:
```bash
cd backend
npm start
```

The server should be running on `http://localhost:3001`

You can test with curl (optional):
```bash
# Test CSV upload (replace with actual file path)
curl -X POST http://localhost:3001/api/upload/csv \
  -F "csv=@/path/to/test.csv"

# Test PDF upload (replace with actual file path)
curl -X POST http://localhost:3001/api/upload/certificate \
  -F "certificate=@/path/to/test.pdf"
```

## What Happens When You're Done

1. Frontend uploads a CSV file → Files are saved in `backend/uploads/`
2. Frontend uploads a PDF file → Files are saved in `backend/uploads/`
3. Files get unique names with timestamps to avoid conflicts
4. Backend responds with success and the filename
5. Frontend can use those filenames for future operations

## File Structure After Setup
```
backend/
  ├── app.js
  ├── config/
  │   └── multer.js
  ├── routes/
  │   ├── upload.js
  │   ├── index.js
  │   └── users.js
  └── uploads/
      ├── 1234567890-test.csv
      └── 1234567891-certificate.pdf
```

## Important Notes

- Files are saved with timestamps to prevent overwriting
- CORS is enabled so the frontend can communicate with the backend
- Error handling is included for when files fail to upload
- The backend returns JSON responses that the frontend expects
- Make sure the server is running on port 3001 (as configured in the frontend)

