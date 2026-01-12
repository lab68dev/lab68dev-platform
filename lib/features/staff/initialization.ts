// Staff Portal Initial Setup Script
// Run this script once to create the first admin account

export function initializeStaffPortal() {
  // Check if staff portal is already initialized
  const isInitialized = localStorage.getItem("staff_portal_initialized")
  
  if (isInitialized) {
    console.log("Staff portal already initialized")
    return false
  }

  // Create default admin account
  const defaultAdmin = {
    id: "staff_admin_001",
    email: "admin@lab68dev.com",
    name: "System Administrator",
    role: "admin",
    department: "management",
    employeeId: "ADMIN001",
    phone: "",
    isActive: true,
    isPending: false,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  }

  // Set default admin password (CHANGE THIS IN PRODUCTION!)
  const defaultPassword = "Admin@123456"

  // Initialize staff users
  const staffUsers = [defaultAdmin]
  localStorage.setItem("staff_users", JSON.stringify(staffUsers))

  // Initialize staff passwords
  const staffPasswords = {
    [defaultAdmin.id]: defaultPassword,
  }
  localStorage.setItem("staff_passwords", JSON.stringify(staffPasswords))

  // Initialize empty arrays for other data
  localStorage.setItem("staff_approval_requests", "[]")
  localStorage.setItem("staff_activity_log", "[]")
  localStorage.setItem("resolved_chats", "[]")

  // Mark as initialized
  localStorage.setItem("staff_portal_initialized", "true")

  console.log("Staff portal initialized successfully!")
  console.log("Default Admin Credentials:")
  console.log("Email: admin@lab68dev.com")
  console.log("Password: Admin@123456")
  console.log("⚠️ PLEASE CHANGE THE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!")

  return true
}

// Auto-initialize on import if needed
if (typeof window !== "undefined") {
  // Only auto-run in development mode
  const isDevelopment = process.env.NODE_ENV === "development"
  
  if (isDevelopment && !localStorage.getItem("staff_portal_initialized")) {
    initializeStaffPortal()
  }
}
