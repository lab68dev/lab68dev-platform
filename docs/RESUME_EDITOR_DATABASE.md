# Resume Editor - Database Setup & Usage Guide

## Overview

The Resume Editor now includes database persistence, allowing users to save their resumes to their account and download them as PDF files.

## Database Setup

### 1. Run the Schema

Execute the SQL schema in your Supabase SQL editor:

```bash
# Navigate to Supabase Dashboard > SQL Editor
# Copy and paste the content from: database/resume-schema.sql
# Click "Run"
```

### 2. Verify Tables

After running the schema, verify the following:

- ✅ `resumes` table created
- ✅ Row Level Security (RLS) enabled
- ✅ Policies created (view, insert, update, delete)
- ✅ Indexes created
- ✅ Updated_at trigger created

## Features

### 1. Save Resume to Account

- **Action**: Click "Save" button in header
- **Requirements**: User must be logged in
- **Functionality**:
  - First save creates a new resume record
  - Subsequent saves update the existing record
  - Stores all resume data including:
    - Personal information
    - Summary
    - Experience
    - Education
    - Skills
    - Certifications
    - Section order & visibility
    - Style settings (colors, fonts)
    - Selected template

### 2. Download as PDF

- **Action**: Click "Download PDF" button
- **Format**: A4 size (210mm × 297mm)
- **Quality**: High resolution (scale: 2x)
- **Filename**: `{Resume_Title}_Resume.pdf`
- **Technology**: html2canvas + jsPDF

### 3. Resume Title

- Editable title field in header
- Default: "My Resume"
- Used as filename when downloading

## API Endpoints

### GET /api/resumes

Fetch all resumes for the authenticated user

```typescript
Response: {
  resumes: Resume[]
}
```

### POST /api/resumes

Create a new resume

```typescript
Request Body: {
  title: string
  template: string
  personalInfo: object
  summary: string
  experience: array
  education: array
  skills: array
  certifications: array
  sectionOrder: array
  styleSettings: object
}

Response: {
  resume: Resume
}
```

### GET /api/resumes/[id]

Fetch a specific resume

```typescript
Response: {
  resume: Resume
}
```

### PUT /api/resumes/[id]

Update an existing resume

```typescript
Request Body: Same as POST
Response: {
  resume: Resume
}
```

### DELETE /api/resumes/[id]

Delete a resume

```typescript
Response: {
  success: boolean
}
```

## Database Schema

### resumes table

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- title (TEXT)
- template (TEXT)
- personal_info (JSONB)
- summary (TEXT)
- experience (JSONB array)
- education (JSONB array)
- skills (JSONB array)
- certifications (JSONB array)
- section_order (JSONB array)
- style_settings (JSONB)
- is_public (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Security

### Row Level Security (RLS)

All policies ensure users can only:

- View their own resumes
- Create resumes for themselves
- Update their own resumes
- Delete their own resumes
- View public resumes (if is_public = true)

## User Workflow

### Creating a Resume

1. Navigate to `/dashboard/resume`
2. Design resume using live editor
3. Enter resume title in header
4. Click "Save" button
5. Resume is saved to user's account
6. Resume ID is stored for future updates

### Updating a Resume

1. Make changes to resume
2. Click "Save" button
3. Existing resume is updated
4. Toast notification confirms success

### Downloading Resume

1. Click "Download PDF" button
2. Browser generates PDF from live preview
3. PDF is downloaded with resume title as filename
4. A4 format, high quality output

## Technical Details

### Dependencies

```json
{
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.2"
}
```

### PDF Generation Process

1. Capture resume preview element with html2canvas
2. Convert canvas to image data (PNG)
3. Create jsPDF instance with A4 dimensions
4. Add image to PDF
5. Trigger browser download

### State Management

- `resumeId`: Tracks current resume ID
- `resumeTitle`: Editable title for resume
- `isSaving`: Loading state for save operation
- `isDownloading`: Loading state for download operation

## Notifications

Uses `sonner` toast library for user feedback:

- Success: "Resume saved successfully!"
- Success: "Resume updated successfully!"
- Success: "Resume downloaded successfully!"
- Error: "Failed to save resume. Please try again."
- Error: "Please login to save your resume"

## Next Steps

### Future Enhancements

1. **Resume List Page**: View all saved resumes
2. **Resume Templates Gallery**: Browse and select from saved resumes
3. **Share Resume**: Generate public URL for sharing
4. **Version History**: Track resume changes over time
5. **Export Options**: Word, HTML formats
6. **Resume Analytics**: Track views and downloads

## Installation

### Install Dependencies

```bash
pnpm install html2canvas jspdf
```

### Run Database Schema

```bash
# Copy database/resume-schema.sql content to Supabase SQL Editor
# Execute the SQL
```

### Test the Feature

1. Login to the application
2. Navigate to Resume Editor
3. Create a resume
4. Click "Save" - should save to database
5. Click "Download PDF" - should download PDF file
6. Check Supabase dashboard to verify data

## Troubleshooting

### Save Not Working

- Check if user is authenticated
- Verify Supabase connection
- Check browser console for errors
- Verify RLS policies are active

### PDF Download Not Working

- Check if html2canvas and jspdf are installed
- Verify browser supports File API
- Check console for errors
- Test with simpler content first

### Permission Denied Errors

- Verify RLS policies are correctly set up
- Check user authentication status
- Verify user_id matches authenticated user

## Support

For issues or questions, check:

- Database schema file: `database/resume-schema.sql`
- API routes: `app/api/resumes/`
- Resume editor: `app/dashboard/resume/page.tsx`
