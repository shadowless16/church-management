# Church Management System

A comprehensive full-stack web application for managing church operations including member management, event planning, donation tracking, and reporting.

## Features

### Backend (Django + MongoDB)
- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Member Management**: Complete CRUD operations for church members with detailed profiles
- **Event Management**: Event creation, scheduling, and attendance tracking
- **Donation Management**: Financial tracking with campaign support and reporting
- **Reporting System**: Automated report generation with CSV export functionality
- **Security Features**: Rate limiting, input validation, CSRF protection, and secure password requirements

### Frontend (HTML/CSS/JavaScript)
- **Responsive Dashboard**: Modern, mobile-friendly interface
- **Real-time Data**: Dynamic content loading with API integration
- **Interactive Forms**: User-friendly forms with validation
- **Calendar Integration**: Event calendar with visual scheduling
- **Report Generation**: On-demand report creation and download

## Technology Stack

### Backend
- **Framework**: Django 4.2.7
- **Database**: MongoDB with Djongo ORM
- **Authentication**: JWT tokens with SimpleJWT
- **API**: Django REST Framework
- **Security**: CORS headers, rate limiting, input sanitization

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome 6.0
- **API Communication**: Fetch API with error handling

## Installation & Setup

### Prerequisites
- Python 3.8+
- MongoDB 4.4+
- Git

### Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd church-management-system/backend
   \`\`\`

2. **Create virtual environment**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Environment configuration**
   \`\`\`bash
   cp .env.example .env
   # Edit .env file with your configuration
   \`\`\`

5. **Database setup**
   \`\`\`bash
   python manage.py migrate
   python manage.py createsuperuser
   \`\`\`

6. **Run development server**
   \`\`\`bash
   python manage.py runserver
   \`\`\`

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd ../frontend
   \`\`\`

2. **Serve static files** (using Python's built-in server)
   \`\`\`bash
   python -m http.server 3000
   \`\`\`

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Panel: http://localhost:8000/admin

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

\`\`\`env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DB_NAME=church_management
DB_HOST=mongodb://localhost:27017
DB_USER=
DB_PASSWORD=
DB_AUTH_SOURCE=admin

# Email Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@church.com
\`\`\`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/verify-email/` - Email verification
- `POST /api/auth/password-reset-request/` - Request password reset
- `POST /api/auth/password-reset-confirm/` - Confirm password reset

### Member Management
- `GET /api/members/` - List all members
- `POST /api/members/` - Create new member
- `GET /api/members/{id}/` - Get member details
- `PUT /api/members/{id}/` - Update member
- `DELETE /api/members/{id}/` - Delete member
- `GET /api/members/stats/` - Get member statistics

### Event Management
- `GET /api/events/` - List all events
- `POST /api/events/` - Create new event
- `GET /api/events/{id}/` - Get event details
- `PUT /api/events/{id}/` - Update event
- `DELETE /api/events/{id}/` - Delete event
- `GET /api/events/upcoming/` - Get upcoming events
- `GET /api/events/stats/` - Get event statistics

### Donation Management
- `GET /api/donations/` - List all donations
- `POST /api/donations/` - Create new donation
- `GET /api/donations/{id}/` - Get donation details
- `PUT /api/donations/{id}/` - Update donation
- `DELETE /api/donations/{id}/` - Delete donation
- `GET /api/donations/stats/` - Get donation statistics

### Reports
- `GET /api/reports/` - List all reports
- `POST /api/reports/generate/membership/` - Generate membership report
- `POST /api/reports/generate/financial/` - Generate financial report
- `GET /api/reports/{id}/download/` - Download report
- `GET /api/reports/dashboard-stats/` - Get dashboard statistics

## Database Schema

### User Model
- Authentication and user management
- Role-based permissions (admin, pastor, secretary, member)
- Profile information and security features

### Member Model
- Personal information (name, email, phone, address)
- Church-specific data (member ID, join date, ministry involvement)
- Status tracking (active, inactive, new)

### Event Model
- Event details (title, description, date, time, location)
- Organizer and ministry association
- Attendance tracking and recurring event support

### Donation Model
- Financial tracking (amount, date, type, method)
- Campaign association and donor information
- Anonymous donation support

## Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control
- Session management with automatic logout
- Account lockout after failed attempts

### Data Protection
- Input validation and sanitization
- CSRF protection
- Rate limiting on sensitive endpoints
- Secure password requirements
- Email verification for new accounts

### API Security
- CORS configuration
- Request throttling
- Secure headers (XSS protection, content type sniffing)
- HTTPS enforcement in production

## Performance Optimization

### Backend
- Database query optimization
- Pagination for large datasets
- Caching for frequently accessed data
- Efficient serialization

### Frontend
- Lazy loading of content
- Optimized API calls
- Responsive design for mobile devices
- Minimal JavaScript bundle size

## Common Pitfalls & Solutions

### Database Connection Issues
- Ensure MongoDB is running
- Check connection string in .env file
- Verify authentication credentials

### CORS Errors
- Update CORS_ALLOWED_ORIGINS in settings.py
- Ensure frontend and backend URLs match

### Token Expiration
- Implement automatic token refresh
- Handle 401 responses gracefully
- Provide clear login prompts

### File Upload Issues
- Configure MEDIA_ROOT and MEDIA_URL
- Set appropriate file size limits
- Validate file types for security

## Deployment

### Production Considerations
- Set DEBUG=False
- Use environment variables for secrets
- Configure proper database settings
- Set up SSL/HTTPS
- Configure static file serving
- Set up monitoring and logging

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS
- **Database**: MongoDB Atlas, self-hosted MongoDB
- **Frontend**: Netlify, Vercel, or serve with Django

## Developer Guide

### Project Structure

- `backend/` — Django backend (API, models, authentication, business logic)
- `frontend/` — HTML/CSS/JS frontend (dashboard, forms, static assets)
- `app/`, `css/`, `js/`, `public/`, `img/`, `styles/` — Additional static and UI resources

### Running the Project Locally

**Backend:**
1. `cd backend`
2. Create and activate a virtual environment
3. `pip install -r requirements.txt`
4. Configure `.env` (see Environment Variables section)
5. `python manage.py migrate`
6. `python manage.py runserver`

**Frontend:**
1. `cd frontend`
2. `python -m http.server 3000`
3. Visit [http://localhost:3000](http://localhost:3000)

### Adding Features

**Backend:**
- Add models in `backend/<app>/models.py`
- Add serializers in `backend/<app>/serializers.py`
- Add API views in `backend/<app>/views.py`
- Register routes in `backend/<app>/urls.py`
- Run `python manage.py makemigrations && python manage.py migrate`

**Frontend:**
- Add/modify UI in `frontend/*.html` and `frontend/*.js`
- Use `frontend/api.js` for API calls
- Use modular JS files for each feature (e.g., `members.js`, `events.js`)

### Testing

- Backend: Add tests in `backend/<app>/tests.py`, run with `python manage.py test`
- Frontend: Manual testing via browser (add automated tests as needed)

### Coding Standards

- Use clear, descriptive names for variables, functions, and files
- Keep backend logic in Django apps, frontend logic in JS modules
- Use environment variables for secrets and configuration
- Write docstrings/comments for complex logic
- Follow PEP8 for Python, and standard JS style for frontend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

## Future Enhancements

- Email notification system
- Payment gateway integration
- Multi-church support
