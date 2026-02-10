# JWT Middleware - Simple Explanation

## 🎯 What is JWT and Why Do We Use It?

**JWT (JSON Web Token)** is a system that provides user authentication. 

**Simple Example:**
- The user logs in (email + password)
- The server says "login successful" and returns a JWT token
- This token is like the user's ID card
- The user presents this token with every request
- The server checks the token and says "yes, this user is really logged in"

**Real Life Analogy:**
- You receive an ID card at the hotel entrance
- With this card, you can go wherever you are allowed inside the hotel
- You cannot walk around the hotel without the card
- JWT token = Hotel ID card

## 🚀 Setup (Simple Steps)

### 1. Create a .env File

Create a file named `.env` in the backend folder and write the following into it:

```env
JWT_SECRET=write_your_secret_key_here
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db"
PORT=3001
```

**Important:** Put a real secret key in `JWT_SECRET` (example: `abc123xyz789`)

### 2. Required Packages Are Already Installed ✅

The required packages are already installed; you do not need to do anything extra.

## 🔐 Middleware Functions (What Do They Do?)

### 1. `authenticateToken` - ID Card Check

This function checks the JWT token in the incoming request.

**What Does It Do?**
- Checks whether there is a token in the "Authorization" header of the incoming request
- If there is a token, it verifies whether the token is valid
- If the token is valid, it adds user information to `req.user`
- If there is no token or it is invalid, it returns an error like "please log in"

**Basic Usage:**
```javascript
import { authenticateToken } from '../middlewares/authMiddleware.js';

// Only logged-in users can access this route
router.get('/profilim', authenticateToken, (req, res) => {
  // req.user contains user information
  res.json({ 
    message: 'Welcome!', 
    user: req.user 
  });
});
```

### 2. `authorizeRoles` - Role/Authorization Check

This function checks which role the user has.

**What Does It Do?**
- Checks the user's role (such as ADMIN, HOTEL_OWNER, USER)
- Allows access only to users with the specified roles
- Returns a "you are not authorized" error for unauthorized users

**Basic Usage:**
```javascript
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

// Only users with the ADMIN role can access
router.get('/admin-panel', authenticateToken, authorizeRoles(['ADMIN']), (req, res) => {
  res.json({ message: 'Welcome to the admin panel!' });
});

// Users with ADMIN or HOTEL_OWNER roles can access
router.get('/otel-yonetimi', authenticateToken, authorizeRoles(['ADMIN', 'HOTEL_OWNER']), (req, res) => {
  res.json({ message: 'Welcome to the hotel management panel!' });
});
```

### 3. `authorizeOwnResource` - Access to Own Data

This function ensures that users can access only their own data.

**What Does It Do?**
- Allows the user to access only their own data
- Prevents access to other users' data
- Admin users can access everyone's data

**Basic Usage:**
```javascript
import { authenticateToken, authorizeOwnResource } from '../middlewares/authMiddleware.js';

// The user can update only their own profile
router.put('/profilim/:userId', authenticateToken, authorizeOwnResource(req.params.userId), (req, res) => {
  // Profile update operation
  res.json({ message: 'Profile updated!' });
});
```

## 📝 Practical Examples

### Example 1: User Profile

```javascript
// The user can view their own profile
router.get('/profilim', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Your profile information', 
    user: req.user 
  });
});

// Admin can see all users
router.get('/tum-kullanicilar', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});
```

### Example 2: Hotel Management

```javascript
// A hotel owner can create a hotel
router.post('/otel-ekle', authenticateToken, authorizeRoles(['HOTEL_OWNER']), async (req, res) => {
  // Hotel creation operation
  res.json({ message: 'Hotel added successfully!' });
});

// The user can see only their own reservations
router.get('/rezervasyonlarim/:userId', authenticateToken, authorizeOwnResource(req.params.userId), async (req, res) => {
  // List their own reservations
  res.json({ message: 'Your reservations' });
});
```

## ❌ Error Messages

The middleware returns the following errors (currently in Turkish in the implementation):

- **401 Unauthorized**: "Erişim token'ı bulunamadı. Lütfen giriş yapın."
- **403 Forbidden**: "Bu işlem için yetkiniz bulunmamaktadır."
- **500 Internal Server Error**: "Sunucu hatası. Lütfen daha sonra tekrar deneyin."

## 🔒 Security Recommendations

1. **JWT_SECRET**: Use a strong and unique secret key
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Keep token lifetimes reasonable (e.g., 24 hours)

## 🧪 Testing

### Testing with Postman

1. **Get a token from the login endpoint**
2. **Add "Bearer TOKEN" to the Authorization header**
3. **Test protected routes**

### Testing with cURL

```bash
# Sending a request with a token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3001/api/users/profile/123
```

## ❓ Frequently Asked Questions

**Q: How do I use the middleware?**  
A: Import it in your routes and place it before the route handler in the definition.

**Q: Can I use more than one middleware?**  
A: Yes! You can chain them in order: `authenticateToken, authorizeRoles(['ADMIN'])`

**Q: I am getting an error, what should I do?**  
A: Make sure that you have defined `JWT_SECRET` in the `.env` file.

## 📚 Summary

The JWT middleware provides 3 main functions:

1. **authenticateToken** → Has the user logged in?
2. **authorizeRoles** → Does the user have the required authorization/role?
3. **authorizeOwnResource** → Is the user accessing their own data?

By using these 3 functions, you can build secure APIs! 🎉
