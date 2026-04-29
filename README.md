# 🚗 Smart Vehicle Management System

A comprehensive parking and vehicle management solution built with Node.js, Express, and PostgreSQL. This system provides role-based access for users to manage their vehicles and reservations, while giving employees powerful tools to oversee parking operations, issue fines, and generate revenue reports.

## ✨ Key Features

### 👤 User Features
- **Vehicle Management**: Add, view, and delete personal vehicles with detailed information
- **Smart Reservations**: Book parking spaces in available lots with real-time availability
- **Payment Tracking**: View unpaid tickets and fines with filtering and sorting options
- **Transaction History**: Complete payment history for parking fees and fines

### 👩‍💼 Employee/Admin Features
- **Parking Lot Management**: Oversee multiple parking lots and space allocation
- **User Administration**: Manage user accounts and vehicle registrations
- **Fine Management**: Issue fines with detailed reasons and amount tracking
- **Revenue Analytics**: Comprehensive daily and yearly revenue reporting
- **Activity Logs**: Real-time monitoring of parking activities and user actions
- **Reservation Oversight**: View and manage all user reservations across lots

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js (ES Modules)
- **Database**: PostgreSQL with connection pooling
- **Authentication**: Passport.js with bcrypt password hashing
- **Frontend**: EJS templating with Tailwind CSS
- **Session Management**: Express-session with flash messaging
- **Build Tools**: PostCSS with Autoprefixer

## 🏗️ Architecture Highlights

### Security & Authentication
- **Dual Role System**: Separate authentication flows for users and employees
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Session Management**: Secure session handling with flash messaging
- **Route Protection**: Role-based middleware for endpoint security

### Database Design
- **Relational Integrity**: Well-structured PostgreSQL schema with foreign key constraints
- **Data Consistency**: Proper constraint handling for vehicle deletion and reservation management
- **Revenue Tracking**: Dedicated tables for daily and yearly revenue analytics
- **Audit Trail**: Comprehensive logging system for all user activities

### User Experience
- **Responsive Design**: Tailwind CSS for modern, mobile-first UI
- **Real-time Updates**: Dynamic space availability and reservation status
- **Intuitive Navigation**: Role-based dashboards with clear action flows
- **Error Handling**: User-friendly error messages and validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vehicle-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Create a PostgreSQL database named `Vehicles`
   - Update database credentials in `index.js` (line 30-36)
   - Run your database schema migrations

4. **Build CSS Assets**
   ```bash
   npm run build:css
   ```

5. **Start the application**
   ```bash
   node index.js
   ```

6. **Access the application**
   - Open your browser to `http://localhost:3000`
   - Register as a new user or employee to get started

## 📊 Database Schema

The system includes the following core entities:
- **Users & Employees**: Separate authentication and profile management
- **Vehicles**: User-owned vehicle registration and tracking
- **Lots & Spaces**: Hierarchical parking space management
- **Reservations**: Time-based space booking system
- **Tickets & Fines**: Violation tracking and payment processing
- **Payments**: Transaction history and status tracking
- **Revenue Analytics**: Daily and yearly financial reporting

## 🎯 Current Strengths

- **Scalable Architecture**: Modular design supports easy feature expansion
- **Security First**: Proper authentication, authorization, and data validation
- **Real-time Operations**: Live space availability and reservation management
- **Comprehensive Reporting**: Detailed analytics for business intelligence
- **User-Centric Design**: Intuitive interfaces for both end-users and administrators
- **Data Integrity**: Robust constraint handling and error management

## 🔮 Future Development Plans

### Phase 1: Security & Performance Enhancements
- [ ] **Environment Configuration**: Migrate to dotenv for secure credential management
- [ ] **Session Security**: Implement CSRF protection and secure cookie settings
- [ ] **Rate Limiting**: Add brute-force protection for login endpoints
- [ ] **Database Optimization**: Connection pooling and query optimization
- [ ] **Error Handling**: Comprehensive error boundaries and logging

### Phase 2: Feature Expansion
- [ ] **Payment Integration**: Stripe/PayPal integration for online payments
- [ ] **Mobile App**: React Native companion app for mobile users
- [ ] **QR Code System**: QR-based entry/exit for contactless parking
- [ ] **Notification System**: Email/SMS alerts for reservations and fines
- [ ] **Analytics Dashboard**: Advanced reporting with charts and insights

### Phase 3: Advanced Features
- [ ] **AI-Powered Optimization**: Machine learning for space allocation
- [ ] **IoT Integration**: Smart sensors for automated space detection
- [ ] **Multi-tenant Support**: Support for multiple parking facility operators
- [ ] **API Development**: RESTful APIs for third-party integrations
- [ ] **Real-time Monitoring**: WebSocket-based live updates

### Phase 4: Enterprise Features
- [ ] **Microservices Architecture**: Decompose into scalable services
- [ ] **Docker Containerization**: Container-based deployment
- [ ] **Cloud Migration**: AWS/Azure deployment with auto-scaling
- [ ] **Advanced Analytics**: Business intelligence and predictive analytics
- [ ] **Compliance**: GDPR and data protection compliance

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow ES6+ JavaScript conventions
- Maintain consistent code formatting
- Add appropriate error handling
- Update documentation for new features
- Test thoroughly before submitting PRs

##  Acknowledgments

- Built with modern web technologies for optimal performance
- Inspired by real-world parking management challenges
- Designed with scalability and user experience in mind

## 👨‍💻 Credits

**Developer:** Gursher Singh  
**LinkedIn:** [https://www.linkedin.com/in/gursher-singh-aa7a72320/](https://www.linkedin.com/in/gursher-singh-aa7a72320/)

## 📞 Support

For questions, issues, or feature requests:
- Create an issue in this repository
- Reach out to the development team
- Check the documentation for common solutions

---

**Built with ❤️ for efficient parking management**
