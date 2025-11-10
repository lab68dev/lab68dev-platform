# Staff Portal Documentation

## Overview

The Staff Portal is a comprehensive management system for Lab68 Dev Platform staff members to manage users, handle support requests, monitor analytics, and oversee platform operations.

## Features

### 🔐 Staff Authentication

- **Staff Sign-Up**: Registration system with admin approval workflow
- **Staff Sign-In**: Secure login with password visibility toggle
- **Role-Based Access**: Admin, Support, and Moderator roles with different permissions

### 📊 Staff Dashboard

- **Real-time Statistics**:
  - Total Users
  - Active Support Chats
  - Pending Tickets
  - Daily Resolution Count
- **Quick Actions**: Direct access to all management features
- **Performance Metrics**: Response time, resolution rate, staff utilization
- **System Status**: Monitor API, Database, and Live Chat service health
- **Activity Log**: Track all staff actions and changes

### 👥 User Management

- **View All Users**: Search and filter platform users
- **User Statistics**: Total, Active, and Blocked user counts
- **Block/Unblock Users**: Moderate user access
- **Delete Users**: Remove users from the platform (admin only)
- **Export Users**: Download user data as JSON

### 🛡️ Staff Management

- **Approval System**: Review and approve new staff registration requests
- **Staff List**: View all staff members with detailed information
- **Role Management**: View staff roles (admin, support, moderator)
- **Activate/Deactivate**: Enable or disable staff accounts (admin only)
- **Delete Staff**: Remove staff members (admin only)
- **Activity Tracking**: Monitor all staff actions

### 💬 Live Support (Integrated)

- Access existing live chat support dashboard
- Real-time customer support queue
- Message history and chat resolution

### 📈 Analytics & Reports

- **User Growth**: 7-day user registration trends
- **Support Activity**: Chat volume over time
- **Key Metrics**:
  - Total Users with growth indicators
  - Total Support Chats
  - Average Response Time
  - Resolution Rate
- **Performance Metrics**:
  - Staff Utilization
  - Customer Satisfaction
  - First Response Rate

## Routes

### Public Routes

- `/staff/login` - Staff login page
- `/staff/signup` - Staff registration (requires admin approval)

### Protected Routes (Requires Authentication)

- `/staff/dashboard` - Main staff dashboard
- `/staff/dashboard/users` - User management
- `/staff/dashboard/staff` - Staff management (admin/moderator only)
- `/staff/dashboard/analytics` - Analytics and reports
- `/dashboard/support` - Live support dashboard (existing)

## User Roles

### Admin

- **Full Access** to all features
- Can approve/reject staff registrations
- Can activate/deactivate any staff member
- Can delete users and staff
- Can access all analytics and reports

### Moderator

- Can view and manage staff members
- Can approve/reject staff registrations
- Can block/unblock users
- Can access analytics
- Cannot delete staff or users

### Support

- Can access live support features
- Can view user information
- Can access basic analytics
- Cannot manage staff members
- Cannot modify user accounts

## Initial Setup

### Default Admin Account

The system automatically creates a default admin account on first access:

```text
Email: admin@lab68dev.com
Password: Admin@123456
```

**⚠️ IMPORTANT**: Change this password immediately after first login!

### Creating Additional Staff

1. Staff member visits `/staff/signup`
2. Fills out registration form with:
   - Full Name
   - Employee ID
   - Company Email
   - Phone Number (optional)
   - Department
   - Password (min. 8 characters)
3. Request is submitted and appears in "Pending Approvals"
4. Admin/Moderator reviews request in Staff Management
5. Admin approves or rejects the request
6. If approved, staff member can login at `/staff/login`

## Data Storage

All data is stored in localStorage:

- `staff_users` - Staff member accounts
- `staff_passwords` - Staff passwords (should be hashed in production)
- `staff_approval_requests` - Pending registration requests
- `staff_activity_log` - Activity tracking (last 100 actions)
- `staff_session` - Current logged-in staff session
- `staff_portal_initialized` - Initialization flag

## Security Features

✅ Authentication required for all staff routes
✅ Role-based access control
✅ Password visibility toggles
✅ Activity logging for all actions
✅ Session management
✅ Account approval workflow
✅ Account activation/deactivation

## Activity Logging

All staff actions are logged with:

- Staff ID and name
- Action type
- Description
- Timestamp

Logged Actions:

- Staff login/logout
- User block/unblock
- User deletion
- Staff approval/rejection
- Staff activation/deactivation
- Staff deletion
- Data export

## Departments

Available departments for staff:

- Customer Support
- Technical Support
- Content Moderation
- Sales
- Development
- Management
- Human Resources
- Marketing

## Best Practices

### For Admins

1. Change default admin password immediately
2. Review staff registration requests promptly
3. Regularly audit staff activity logs
4. Monitor system status and performance
5. Export user data regularly for backups

### For Support Staff

1. Maintain professional communication
2. Log all customer interactions
3. Monitor response time targets
4. Use proper categorization for tickets
5. Keep customer information confidential

### Security

1. Use strong passwords (min. 8 characters)
2. Log out when not in use
3. Don't share credentials
4. Report suspicious activities
5. Keep employee IDs confidential

## Production Deployment

Before deploying to production:

### Critical Changes Required

1. **Hash Passwords**: Implement bcrypt or similar for password hashing
2. **Database Migration**: Move from localStorage to secure database
3. **Environment Variables**: Store sensitive data in .env
4. **HTTPS Only**: Enforce SSL/TLS for all connections
5. **Rate Limiting**: Add rate limiting to prevent brute force
6. **Session Management**: Implement secure session tokens (JWT)
7. **Change Default Credentials**: Remove or randomize default admin password

### Optional Enhancements

- Email notifications for approvals/rejections
- Two-factor authentication (2FA)
- Advanced analytics with charts
- Real-time WebSocket for live updates
- Audit trail export functionality
- Custom role creation
- Granular permissions system

## Troubleshooting

### Cannot Login

- Verify email and password are correct
- Check if account is active (contact admin)
- Clear browser cache and try again
- Ensure staff portal is initialized

### Registration Not Approved

- Contact your administrator
- Check email for employee ID format
- Ensure all required fields are filled
- Wait for admin review (may take 24-48 hours)

### Missing Features

- Verify your role has permission
- Contact admin to request access
- Check if you're logged in
- Refresh the page

## Technical Support

For technical support:

- Email: <lab68dev@gmail.com>
- Internal: Contact your administrator

## Version History

**v1.0.0** (Current)

- Initial release
- Staff authentication system
- User management
- Staff management with approval workflow
- Analytics dashboard
- Activity logging
- Role-based access control
