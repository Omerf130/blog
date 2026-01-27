# Environment Variables Setup

Create a `.env` file in the root directory with these variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legal-blog?retryWrites=true&w=majority

# Session Configuration
SESSION_COOKIE_NAME=keshet_session
SESSION_TTL_DAYS=14
SESSION_SECRET=your-strong-random-secret-here-min-32-chars

# Admin Bootstrap (one-time use to create first admin)
ADMIN_BOOTSTRAP_SECRET=your-bootstrap-secret-here

# WhatsApp Integration
WHATSAPP_DEFAULT_NUMBER=972501234567
```

## How to Get MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you don't have one)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with your desired database name (e.g., `legal-blog`)

## Generate Strong Secrets

For `SESSION_SECRET` and `ADMIN_BOOTSTRAP_SECRET`, generate random strings:

**Using Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using online tool:**
- Visit: https://generate-secret.vercel.app/32

