# Testing Guide

## Quick Start

### Prerequisites
```bash
# Backend (FastAPI)
cd api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend (Next.js)
cd web
npm install
```

### Start Development Servers

**Terminal 1 - Backend:**
```bash
cd api
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Test Scenarios

### 1. Authentication Flow

#### Sign Up (Email/Password)
1. Go to http://localhost:3000/auth
2. Click "Sign Up" tab
3. Enter email: `test@example.com`
4. Enter password: `TestPass123!` (min 8 chars)
5. Click "Sign Up"
6. ✅ Should redirect to /dashboard
7. ✅ Should see welcome message

#### Sign In
1. Go to http://localhost:3000/auth
2. Click "Sign In" tab
3. Enter credentials from above
4. Click "Sign In"
5. ✅ Should redirect to /dashboard

### 2. Receipt Upload

#### Upload via File Picker
1. Go to http://localhost:3000/receipts/upload
2. Click "Choose File" or drag-and-drop
3. Select a receipt image (JPEG, PNG, PDF, or TXT)
4. ✅ Should show preview
5. Click "Upload Receipt"
6. ✅ Should show success message
7. ✅ Should redirect to /receipts

#### Test Receipt (Create test-receipt.txt)
```
WALMART
123 Main St
Date: 01/12/2026

Bananas          $2.99
Milk             $4.99
Bread            $3.49

Subtotal        $11.47
Tax              $0.92
Total           $12.39

Thank you!
```

### 3. Receipt List View

1. Go to http://localhost:3000/receipts
2. ✅ Should see uploaded receipts
3. ✅ Each card shows:
   - Store name (capitalized)
   - Purchase date
   - Total amount with $
   - Parse status badge
4. Click on a receipt card
5. ✅ Should navigate to detail view

#### Empty State
1. Delete all receipts from database
2. Go to /receipts
3. ✅ Should show "No receipts yet" message
4. ✅ Should show "Upload Receipt" button

### 4. Receipt Detail View

1. Click on any receipt from list
2. ✅ Should show:
   - Store name (capitalized)
   - Purchase date
   - Parse status with icon
   - Total amount with $
   - Line items (if parsed)
3. ✅ Status colors:
   - Success = Green
   - Pending = Amber (spinning)
   - Failed = Amber (not red!)
4. ✅ Missing data shows "Total not available" (not "—")

### 5. Insights Feed

#### With Data (3+ Receipts)
1. Upload at least 3 receipts
2. Go to http://localhost:3000/insights
3. ✅ Should show insights:
   - Purchase frequency
   - Price trends (if same item bought 2+ times)
   - Common purchases
   - Store patterns (if 5+ receipts)
4. ✅ Each insight shows:
   - Colored icon
   - Title
   - Description
   - Confidence badge
   - Data point count
   - Generated date
   - "View related receipts" link

#### Empty State (No Data)
1. Delete all receipts
2. Go to /insights
3. ✅ Should show:
   - Sparkles icon
   - "No insights yet"
   - Helpful message
   - "Upload Receipt" button

### 6. Navigation

#### Sidebar (Desktop)
1. ✅ Logo and app name at top
2. ✅ User profile card (clickable)
3. ✅ Theme toggle (rounded-xl)
4. ✅ Navigation links:
   - Home (dashboard)
   - Receipts
   - Insights
   - Deals
5. ✅ Sign Out button at bottom
6. ✅ Footer links (About, Contact, Privacy, Terms)

#### Collapse/Expand
1. Click collapse button
2. ✅ Sidebar shrinks to 80px
3. ✅ Icons remain visible
4. ✅ Text hides
5. ✅ Main content adjusts margin
6. Refresh page
7. ✅ Sidebar remembers state

### 7. Theme Toggle

1. Click theme toggle in sidebar
2. ✅ Should switch light ↔ dark
3. ✅ No glitch or flash
4. ✅ All colors update smoothly
5. Refresh page
6. ✅ Theme persists

### 8. Dashboard

1. Go to http://localhost:3000/dashboard
2. ✅ Should show:
   - Welcome message
   - Quick stats (receipts, spending, insights)
   - Upload receipt card
   - View insights card
   - Recent activity section

---

## Common Issues

### Issue: "No auth token found"
**Solution:** Sign in again, check localStorage

### Issue: "Failed to upload receipt"
**Solution:** Check backend is running on port 8000

### Issue: "Couldn't load receipts"
**Solution:** Check database connection, verify auth token

### Issue: Sidebar glitches on toggle
**Solution:** Clear localStorage, refresh page

### Issue: Theme doesn't persist
**Solution:** Check localStorage permissions

### Issue: Insights show "No insights yet" with receipts
**Solution:** Need 3+ receipts for insights to generate

---

## API Testing

### Create Test User
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

### Upload Test Receipt
```bash
curl -X POST http://localhost:8000/api/receipts/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-receipt.jpg"
```

### Get Insights
```bash
curl -X GET http://localhost:8000/api/insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Phase 1 Web App Checklist

### Must Have
- [x] User can sign up and sign in
- [x] User can upload receipts
- [x] User can view receipt list
- [x] User can view receipt details
- [x] User can see insights
- [x] All pages have loading states
- [x] All pages have error states
- [x] All pages have empty states
- [x] Navigation works correctly
- [x] Theme toggle works
- [x] Sidebar persists state
- [x] Animations are smooth
- [x] Mobile responsive

### Nice to Have
- [ ] Receipt search/filter
- [ ] Infinite scroll
- [ ] Receipt editing
- [ ] Bulk upload
- [ ] Export data
- [ ] Share insights

---

## Performance Targets

### Page Load Times
- Dashboard: <1s
- Receipts list: <1.5s
- Receipt detail: <1s
- Insights: <2s
- Upload: <500ms

### API Response Times
- Auth: <500ms
- Upload: <3s (depends on OCR)
- List receipts: <500ms
- Get receipt: <300ms
- Get insights: <1s

---

## Browser Support

### Desktop
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+
- ✅ Samsung Internet 14+

---

## Backend Tests

### Run API Tests
```bash
cd api
pytest
```

### Run with Coverage
```bash
cd api
pytest --cov=api --cov-report=html
```

### Test Specific Module
```bash
cd api
pytest tests/test_receipts.py -v
```

---

## Frontend Tests (Future)

### Run Unit Tests
```bash
cd web
npm test
```

### Run E2E Tests
```bash
cd web
npm run test:e2e
```

---

## Deployment Testing

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://...
SECRET_KEY=...
UPLOAD_DIR=./uploads

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Health Checks
- Backend: GET /health
- Frontend: GET /
- Database: Check connection

---

## Support

### Issues?
1. Check console for errors
2. Check network tab
3. Check backend logs
4. Clear localStorage
5. Try incognito mode

---

**Phase 1 Web App Testing Complete** ✅
