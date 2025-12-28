# SwasthiQ EMR - Appointment Management System

A production-ready appointment management system built with FastAPI, GraphQL, Next.js, and TypeScript.

## 🎯 Assignment Completion Status

All required features implemented:
- ✅ 12+ mock appointments with complete data
- ✅ Filtering by date, status, and doctorName
- ✅ Time conflict detection for same doctor
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Duration field with validation
- ✅ Tab navigation (All, Today, Upcoming, Past)
- ✅ Backend documentation with production patterns
- ✅ Real-time UI updates with Apollo cache

## 🏗️ Architecture

### Tech Stack

**Backend:**
- FastAPI 0.104+ - High-performance async Python framework
- Strawberry GraphQL - Code-first GraphQL with Python type hints
- Python 3.11+ - Latest stable Python
- Uvicorn - ASGI server for production

**Frontend:**
- Next.js 16 - React framework with App Router and Turbopack
- Apollo Client 3 - GraphQL client with intelligent caching
- TypeScript 5 - Type-safe development
- Tailwind CSS 3 - Utility-first CSS

**Data Layer (Mock):**
- In-memory Python dictionary simulating PostgreSQL Aurora

## 📊 GraphQL Schema Design

### Query Structure

The `appointments` query supports flexible filtering for efficient data retrieval:

```
query GetAppointments(
  $date: String          # Filter: ISO date (YYYY-MM-DD)
  $status: String        # Filter: Scheduled|Confirmed|Completed|Cancelled
  $doctorName: String    # Filter: Exact doctor name match
) {
  appointments(date: $date, status: $status, doctorName: $doctorName) {
    id
    patientName
    date
    time
    duration
    doctorName
    status
    mode
  }
}
```

**Design Rationale:**
- Optional filters enable single endpoint for all list views
- Reduces API calls - no need for separate endpoints
- Server-side filtering reduces payload size
- Type-safe with Strawberry's Python typing

### Mutation Structure

```
mutation CreateAppointment($input: AppointmentInput!) {
  createAppointment(input: $input) {
    id
    patientName
    date
    time
    duration
    doctorName
    status
    mode
  }
}
```

**Validation Rules:**
1. All fields required except status (defaults to "Scheduled")
2. Duration must be positive integer
3. Time conflict check before insertion
4. Unique ID generation on backend

## 🔒 Data Consistency Strategy

### Production Implementation (Aurora + AppSync)

#### 1. **Transaction Management**
```
# Pseudocode for Aurora transaction
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  
  # Check for conflicts with row-level locking
  SELECT * FROM appointments 
  WHERE doctor_name = ? AND date = ? AND time_range && ?
  FOR UPDATE;
  
  # Insert if no conflicts
  INSERT INTO appointments (...) VALUES (...);
  
COMMIT;
```

#### 2. **Unique Constraints**
```
CREATE UNIQUE INDEX idx_unique_appointment 
ON appointments(doctor_name, date, time_range)
WHERE deleted_at IS NULL;
```

#### 3. **Idempotency Keys**
- Client generates unique request ID (UUID)
- Backend stores completed mutations in idempotency table
- Duplicate requests return cached result instead of re-executing
- TTL: 24 hours

```
idempotency_key = request.headers.get("Idempotency-Key")
cached = redis.get(f"mutation:{idempotency_key}")
if cached:
    return cached  # Return previous result
```

#### 4. **Optimistic Locking**
```
# Version-based concurrency control
UPDATE appointments 
SET status = ?, version = version + 1
WHERE id = ? AND version = ?;

if affected_rows == 0:
    raise ConcurrencyError("Appointment was modified")
```

#### 5. **AppSync Real-time Subscriptions**

When mutations occur, AppSync publishes to subscribed clients:

```
subscription OnAppointmentChange {
  onCreateAppointment {
    id
    patientName
    status
  }
  onUpdateAppointment {
    id
    status
  }
  onDeleteAppointment {
    id
  }
}
```

**Flow:**
1. Client submits mutation → AppSync resolver
2. Lambda/Backend processes with transaction
3. On success, AppSync triggers subscription
4. All connected clients receive real-time update
5. Apollo cache automatically updates UI

#### 6. **Conflict Resolution**

**Time Overlap Detection Algorithm:**
```
# Two appointments overlap if:
# (StartA < EndB) AND (EndA > StartB)

new_start = parse_time(time)
new_end = new_start + timedelta(minutes=duration)

for existing in db_appointments:
    existing_start = parse_time(existing.time)
    existing_end = existing_start + timedelta(minutes=existing.duration)
    
    if (new_start < existing_end) and (new_end > existing_start):
        raise ConflictError("Time slot unavailable")
```

#### 7. **Audit Trail**
```
CREATE TABLE appointment_audit (
    id UUID PRIMARY KEY,
    appointment_id UUID,
    action VARCHAR(10),  -- CREATE|UPDATE|DELETE
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

## 📁 Project Structure

```
swasthiq-emr-assignment/
├── backend/
│   ├── main.py                 # FastAPI + GraphQL server
│   │   ├── Mock data (12 appointments)
│   │   ├── Query resolvers with filtering
│   │   ├── Mutation resolvers with validation
│   │   ├── Time conflict detection
│   │   └── Production comments (AppSync/Aurora)
│   ├── requirements.txt        # Python dependencies
│   └── venv/                   # Virtual environment
│
└── frontend/
    ├── app/
    │   ├── page.tsx            # Appointments list with tabs & filters
    │   ├── layout.tsx          # Root layout with Apollo Provider
    │   ├── ApolloWrapper.tsx   # Client-side Apollo wrapper
    │   └── appointments/
    │       ├── new/
    │       │   └── page.tsx    # Create form with validation
    │       └── [id]/
    │           └── edit/
    │               └── page.tsx # Edit form with delete
    │
    ├── lib/
    │   ├── graphql/
    │   │   ├── client.ts       # Apollo Client configuration
    │   │   └── operations.ts   # GraphQL queries & mutations
    │   └── types.ts            # TypeScript interfaces
    │
    ├── components/             # Reusable components (future)
    ├── .env.local              # Environment variables
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm/yarn

### Backend Setup

```
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Mac/Linux

pip install -r requirements.txt
uvicorn main:app --reload
```

Backend: `http://localhost:8000`  
GraphQL Playground: `http://localhost:8000/graphql`

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## 🧪 Testing

### Test Time Conflict Detection

**Scenario 1: Create successful appointment**
- Doctor: Dr. Sarah Johnson
- Date: 2025-12-29
- Time: 12:00
- Duration: 30 min
- ✅ Should succeed (no conflict)

**Scenario 2: Create conflicting appointment**
- Doctor: Dr. Sarah Johnson
- Date: 2025-12-29
- Time: 09:15
- Duration: 30 min
- ❌ Should fail with error: "Time conflict: Dr. Sarah Johnson already has an appointment at 09:15"

### Test Filtering

1. **Filter by Date**: Select 2025-12-29 → Shows 4 appointments
2. **Filter by Status**: Select "Completed" → Shows completed only
3. **Filter by Doctor**: Select "Dr. Sarah Johnson" → Shows her appointments
4. **Combined Filters**: Date + Status + Doctor

### Test Tabs

- **All**: Shows all 12 appointments
- **Today**: Shows appointments for 2025-12-29
- **Upcoming**: Shows future appointments
- **Past**: Shows appointments before today

## 🎨 Features

### Backend Features
- GraphQL API with filtering
- Time conflict detection
- Duration-based scheduling
- Comprehensive error handling
- Production-ready comments

### Frontend Features
- Responsive table layout
- Tab-based navigation
- Multi-filter search
- Color-coded status badges
- Real-time cache updates
- Loading states
- Error boundaries

## 📝 API Examples

### Create Appointment
```
mutation {
  createAppointment(input: {
    patientName: "John Smith"
    date: "2025-12-30"
    time: "14:00"
    duration: 45
    doctorName: "Dr. Sarah Johnson"
    status: "Scheduled"
    mode: "Video"
  }) {
    id
    patientName
  }
}
```

### Filter Appointments
```
query {
  appointments(
    date: "2025-12-29"
    status: "Confirmed"
  ) {
    id
    patientName
    time
  }
}
```

## 🔐 Environment Variables

Create `.env.local` in frontend:
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
```

## 🚢 Deployment

### Backend (Railway/Render)
```
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend (Vercel)
```
npm run build
npm start
```

## 📊 Performance Optimizations

1. **Apollo Cache** - Reduces redundant API calls
2. **Tab Filtering** - Client-side for instant switching
3. **Optimistic Updates** - Immediate UI feedback
4. **Lazy Loading** - Code splitting with Next.js
5. **Memoization** - useMemo for filtered data

## 👨‍💻 Author

**Yash**  
Full Stack Developer | AI/ML Engineer  
Final Year ECE Student

## 📄 License

Assignment project for SwasthiQ EMR - SDE Intern Role
