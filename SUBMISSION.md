# SwasthiQ EMR Assignment Submission

**Candidate Name:** Yashwanth  
**GitHub Username:** Yashwanth2408  
**Submission Date:** December 29, 2025  
**Position Applied:** SDE Intern  

---

## 🔗 Live Application Links

| Resource | URL |
|----------|-----|
| **Live Frontend** | [https://swasthiq-emr-assignment.vercel.app/](https://swasthiq-emr-assignment.vercel.app/) |
| **Backend API** | [https://swasthiq-emr-assignment-production.up.railway.app/](https://swasthiq-emr-assignment-production.up.railway.app/) |
| **GraphQL Playground** | [https://swasthiq-emr-assignment-production.up.railway.app/graphql](https://swasthiq-emr-assignment-production.up.railway.app/graphql) |
| **GitHub Repository** | [https://github.com/Yashwanth2408/swasthiq-emr-assignment](https://github.com/Yashwanth2408/swasthiq-emr-assignment) |

---

## ✅ Assignment Requirements Completion

### Core Requirements (100% Complete)

- ✅ **Backend with FastAPI** - RESTful API with GraphQL implementation
- ✅ **Frontend with Next.js 14** - Modern React framework with App Router
- ✅ **TypeScript Implementation** - Full type safety across frontend and backend
- ✅ **CRUD Operations** - Create, Read, Update, Delete appointments
- ✅ **Search Functionality** - Real-time search across patients and doctors
- ✅ **Filtering** - Multi-criteria filtering (date, doctor, status)
- ✅ **Responsive Design** - Mobile-first, works on all screen sizes
- ✅ **Production Deployment** - Fully deployed and accessible

### Bonus Features Implemented

- ✅ **Time Conflict Detection** - Prevents double-booking for doctors
- ✅ **Interactive Calendar Widget** - Visual date selection with highlighting
- ✅ **Doctor Timeline View** - Day-view schedule visualization
- ✅ **Advanced Filtering System** - Multiple simultaneous filters
- ✅ **Beautiful Modern UI** - Gradient design with animations
- ✅ **Form Validation** - Client-side and server-side validation
- ✅ **Loading States** - Skeleton screens and spinners
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **GraphQL API** - Modern API with precise data fetching
- ✅ **Optimistic UI Updates** - Instant feedback for user actions

---

## 🏗️ Technical Architecture

### Frontend Stack

```
Next.js 14 (App Router)
├── TypeScript
├── React 18
├── Tailwind CSS
├── Apollo Client (GraphQL)
├── Framer Motion (Animations)
└── React Icons
```

**Key Technical Decisions:**
- **Next.js App Router** - Chose for better performance, server components, and modern routing
- **Apollo Client** - Selected for efficient GraphQL caching and state management
- **Tailwind CSS** - Rapid UI development with utility-first approach
- **Framer Motion** - Smooth animations for better UX

### Backend Stack

```
FastAPI (Python)
├── Strawberry GraphQL
├── Uvicorn (ASGI Server)
├── Pydantic (Data Validation)
└── CORS Middleware
```

**Key Technical Decisions:**
- **FastAPI** - Chosen for async support, automatic docs, and type hints
- **Strawberry GraphQL** - Type-safe GraphQL schema with Python dataclasses
- **In-Memory Storage** - Simple for demo; production would use PostgreSQL/MongoDB
- **CORS Configuration** - Properly configured for cross-origin requests

### Deployment Architecture

```
┌─────────────────────────────────────┐
│   Vercel (Frontend Hosting)         │
│   - Edge Network                     │
│   - Automatic HTTPS                  │
│   - CDN Distribution                 │
└─────────────────────────────────────┘
              ↓ GraphQL
┌─────────────────────────────────────┐
│   Railway (Backend Hosting)         │
│   - Container Deployment            │
│   - Auto-scaling                    │
│   - Environment Variables           │
└─────────────────────────────────────┘
```

---

## 🎯 Core Features Implementation

### 1. Appointment Management System

**Create Appointments**
- Form validation with error handling
- Time conflict detection
- Duration selection (15-120 minutes)
- Multiple appointment modes (In-person, Video, Phone)
- Real-time feedback

**View Appointments**
- List view with all appointment details
- Status badges with color coding
- Quick actions (Edit, Delete)
- Empty state handling

**Edit Appointments**
- Pre-filled form with existing data
- Same validation as create
- Optimistic UI updates
- Conflict detection on changes

**Delete Appointments**
- Confirmation dialog
- Cascade handling
- Instant UI update

### 2. Search and Filtering System

**Global Search**
- Real-time search across patient names and doctor names
- Case-insensitive matching
- Instant results
- Search term highlighting

**Advanced Filters**
- **Date Filter** - View appointments for specific dates
- **Status Filter** - Filter by Scheduled, Confirmed, Completed, Cancelled
- **Doctor Filter** - View appointments by doctor
- **Combined Filters** - Apply multiple filters simultaneously

### 3. Calendar Integration

- Interactive calendar widget
- Current date highlighting
- Selected date visualization
- Month navigation
- Date-based filtering

### 4. Doctor Timeline View

- Hourly timeline (8 AM - 8 PM)
- Visual appointment blocks
- Color-coded by status
- Duration visualization
- Quick appointment details on hover

### 5. Time Conflict Detection

**Algorithm:**
```
def check_time_conflict(doctor, date, start_time, duration):
    # Convert to datetime objects
    new_start = parse_time(start_time)
    new_end = new_start + timedelta(minutes=duration)
    
    # Check all existing appointments
    for appointment in appointments:
        if appointment.doctor == doctor and appointment.date == date:
            existing_start = parse_time(appointment.time)
            existing_end = existing_start + timedelta(minutes=appointment.duration)
            
            # Interval overlap check: (StartA < EndB) AND (EndA > StartB)
            if new_start < existing_end and new_end > existing_start:
                return True  # Conflict detected
    
    return False  # No conflict
```

---

## 📊 GraphQL API Schema

### Queries

```
# Get all appointments (with optional filters)
appointments(
  date: String
  status: String
  doctorName: String
): [Appointment!]!

# Get single appointment by ID
appointment(id: String!): Appointment
```

### Mutations

```
# Create new appointment
createAppointment(input: AppointmentInput!): Appointment!

# Update existing appointment
updateAppointment(id: String!, input: AppointmentInput!): Appointment!

# Delete appointment
deleteAppointment(id: String!): DeleteResponse!
```

### Types

```
type Appointment {
  id: String!
  patientName: String!
  date: String!
  time: String!
  duration: Int!
  doctorName: String!
  status: String!
  mode: String!
}

input AppointmentInput {
  patientName: String!
  date: String!
  time: String!
  duration: Int!
  doctorName: String!
  status: String!
  mode: String!
}

type DeleteResponse {
  success: Boolean!
  message: String!
}
```

---

## 🎨 UI/UX Design Highlights

### Design System

**Color Palette:**
- Primary: Indigo (600-700)
- Secondary: Purple (600-700)
- Accent: Pink (600-700)
- Success: Green/Emerald
- Warning: Orange
- Error: Red
- Neutral: Slate (50-900)

**Typography:**
- Headings: Bold, clear hierarchy
- Body: Medium weight for readability
- Labels: Semibold for emphasis

**Components:**
- Rounded corners (xl, 2xl) for modern look
- Gradient backgrounds for visual interest
- Shadow layers for depth
- Border emphasis for structure

### Responsive Design

- **Mobile First** - Designed for small screens first
- **Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Flexible Grid** - Adapts to all screen sizes
- **Touch-Friendly** - Large tap targets (44px minimum)

### Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Form labels and error messages

---

## 🔧 Code Quality & Best Practices

### Frontend

- **Component Structure** - Modular, reusable components
- **Type Safety** - Full TypeScript implementation with strict mode
- **State Management** - Apollo Client cache for global state
- **Error Boundaries** - Graceful error handling
- **Performance** - Code splitting, lazy loading
- **Naming Conventions** - Clear, descriptive names

### Backend

- **Clean Architecture** - Separation of concerns
- **Type Hints** - Full Python type annotations
- **Validation** - Pydantic models for data validation
- **Error Handling** - Custom exceptions with clear messages
- **Code Documentation** - Docstrings for functions
- **API Standards** - RESTful principles with GraphQL

### Version Control

- **Commit Messages** - Clear, descriptive commits
- **Branch Strategy** - Main branch for production
- **Git Ignore** - Proper exclusion of sensitive files
- **.env Management** - Environment variables for configuration

---

## ⚡ Performance Optimizations

### Frontend Optimizations

1. **Code Splitting** - Dynamic imports for routes
2. **Image Optimization** - Next.js Image component
3. **Bundle Size** - Tree shaking unused code
4. **Caching** - Apollo Client cache policies
5. **Lazy Loading** - Load components on demand
6. **Debouncing** - Search input optimization

### Backend Optimizations

1. **Async Operations** - FastAPI async/await
2. **Response Caching** - Potential for Redis integration
3. **Query Optimization** - Efficient data filtering
4. **CORS Optimization** - Specific origin whitelisting

---

## 🧪 Testing Scenarios Covered

### Manual Testing Completed

- ✅ Create appointment with valid data
- ✅ Create appointment with invalid data (validation errors)
- ✅ Edit appointment and update all fields
- ✅ Delete appointment with confirmation
- ✅ Search for patient names
- ✅ Search for doctor names
- ✅ Filter by date
- ✅ Filter by status
- ✅ Filter by doctor
- ✅ Combined filters (date + status + doctor)
- ✅ Calendar date selection
- ✅ Timeline view for different doctors
- ✅ Time conflict detection (same doctor, overlapping times)
- ✅ Responsive design on mobile
- ✅ Responsive design on tablet
- ✅ Responsive design on desktop
- ✅ Browser compatibility (Chrome, Firefox, Safari, Edge)

### Edge Cases Handled

- Empty appointment list
- No search results
- Invalid appointment ID
- Network errors
- Time conflicts
- Form validation errors
- Missing required fields

---

## 📈 Potential Future Enhancements

### Short-term Improvements (1-2 weeks)

1. **User Authentication**
   - JWT-based authentication
   - Role-based access control (Admin, Doctor, Patient)
   - Secure password storage

2. **Database Integration**
   - PostgreSQL for persistent storage
   - Database migrations
   - Connection pooling

3. **Email Notifications**
   - Appointment confirmations
   - Reminder emails 24 hours before
   - Cancellation notifications

4. **Analytics Dashboard**
   - Appointment statistics
   - Doctor performance metrics
   - Peak hours analysis

### Medium-term Improvements (1-2 months)

5. **Patient Profiles**
   - Medical history
   - Contact information
   - Insurance details

6. **Doctor Profiles**
   - Specializations
   - Available time slots
   - Consultation fees

7. **Real-time Updates**
   - GraphQL subscriptions
   - Live appointment updates
   - Notification system

8. **Advanced Search**
   - Fuzzy search
   - Search by date range
   - Search by multiple criteria

### Long-term Improvements (3-6 months)

9. **Telemedicine Integration**
   - Video consultation
   - Screen sharing
   - Chat functionality

10. **Payment Processing**
    - Stripe/Razorpay integration
    - Invoice generation
    - Payment history

11. **Mobile Application**
    - React Native app
    - Push notifications
    - Offline support

12. **Prescription Management**
    - Digital prescriptions
    - Drug database integration
    - E-prescription delivery

---

## 💻 Local Development Setup

### Prerequisites

```
Node.js 18+
Python 3.11+
Git
```

### Installation Steps

**1. Clone Repository**
```
git clone https://github.com/Yashwanth2408/swasthiq-emr-assignment.git
cd swasthiq-emr-assignment
```

**2. Backend Setup**
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**3. Frontend Setup**
```
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with backend URL
npm run dev
```

**4. Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- GraphQL Playground: http://localhost:8000/graphql

---

## 📁 Project Structure

```
swasthiq-emr-assignment/
│
├── frontend/                    # Next.js Frontend
│   ├── app/
│   │   ├── appointments/       # Appointments pages
│   │   │   ├── [id]/edit/     # Edit page
│   │   │   ├── new/           # Create page
│   │   │   └── page.tsx       # List/Dashboard page
│   │   ├── landing/           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home (redirects)
│   │   ├── globals.css       # Global styles
│   │   ├── calendar.css      # Calendar styles
│   │   └── ApolloWrapper.tsx # Apollo Provider
│   │
│   ├── components/
│   │   ├── Calendar.tsx      # Calendar widget
│   │   └── DoctorTimeline.tsx # Timeline component
│   │
│   ├── lib/
│   │   ├── graphql/
│   │   │   ├── client.ts     # Apollo Client setup
│   │   │   └── operations.ts # GraphQL queries/mutations
│   │   └── types.ts          # TypeScript types
│   │
│   ├── public/               # Static assets
│   ├── .env.local           # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── backend/                     # FastAPI Backend
│   ├── main.py                 # Main application
│   ├── requirements.txt        # Dependencies
│   └── runtime.txt            # Python version
│
├── .gitignore
├── README.md                   # Project documentation
└── SUBMISSION.md              # This file
```

---

## ⏱️ Development Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Planning & Setup** | 1 hour | Requirements analysis, tech stack selection, project setup |
| **Backend Development** | 2 hours | FastAPI setup, GraphQL schema, CRUD operations, conflict detection |
| **Frontend Foundation** | 2 hours | Next.js setup, routing, Apollo Client, type definitions |
| **UI Components** | 3 hours | Forms, list view, calendar, timeline, navigation |
| **Styling & UX** | 2 hours | Tailwind CSS, gradients, animations, responsive design |
| **Testing & Debugging** | 1 hour | Manual testing, bug fixes, edge cases |
| **Deployment** | 1 hour | Vercel setup, Railway setup, environment configuration |
| **Documentation** | 1 hour | README, SUBMISSION.md, code comments |
| **Total** | **~13 hours** | End-to-end development |

---

## 🎓 Learning Outcomes

Throughout this assignment, I gained hands-on experience with:

1. **GraphQL API Design** - Schema design, resolvers, queries, mutations
2. **Next.js 14 App Router** - Server components, client components, routing
3. **Full-Stack Integration** - Connecting frontend with backend APIs
4. **Modern UI/UX** - Creating intuitive interfaces with animations
5. **Deployment** - Production deployment on cloud platforms
6. **Time Management** - Prioritizing features and meeting deadlines
7. **Problem Solving** - Time conflict detection algorithm
8. **Documentation** - Writing clear, comprehensive documentation

---

## 🙏 Acknowledgments

Thank you to the **SwasthiQ team** for providing this opportunity to demonstrate my technical skills. I thoroughly enjoyed building this application and focused on:

- **Production-ready code** - Clean, maintainable, scalable
- **User experience** - Intuitive, beautiful, responsive
- **Best practices** - Type safety, error handling, documentation
- **Modern stack** - Latest technologies and patterns

I'm excited about the possibility of contributing to SwasthiQ's mission of improving healthcare through technology. I'm confident this assignment demonstrates my ability to:

- Learn new technologies quickly
- Build full-stack applications
- Write clean, maintainable code
- Create excellent user experiences
- Work independently and meet deadlines

Looking forward to discussing the technical implementation and exploring how I can contribute to your team!

---

## 📞 Contact Information

**Yashwanth**  
- **GitHub:** [@Yashwanth2408](https://github.com/Yashwanth2408)
- **Email:** [Your email]
- **LinkedIn:** [Your LinkedIn]
- **Location:** Narnaund, Haryana, India

---

<div align="center">

**Built with ❤️ for SwasthiQ**

*December 2025*

</div>
