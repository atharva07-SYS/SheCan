const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const ADMIN_CREDENTIALS = {
  name: 'Admin',
  email: 'admin@shecanfoundation.org',
  password: 'Admin@123',
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_CREDENTIALS.email });

    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name : ${existingAdmin.name}`);
      console.log('\n   No changes made.\n');
    } else {
      // Create admin user
      const admin = await User.create(ADMIN_CREDENTIALS);

      console.log('\n✅ Admin user created successfully!');
      console.log('─'.repeat(40));
      console.log(`   Name     : ${admin.name}`);
      console.log(`   Email    : ${ADMIN_CREDENTIALS.email}`);
      console.log(`   Password : ${ADMIN_CREDENTIALS.password}`);
      console.log(`   Role     : ${admin.role}`);
      console.log('─'.repeat(40));
      console.log('\n⚠️  Please change the default password after first login!\n');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
