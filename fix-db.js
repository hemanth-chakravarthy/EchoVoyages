// Simple script to fix the database
// Run with: node fix-db.js

const mongoose = require('mongoose');

const mongoURL = "mongodb+srv://saiananyakatakam:NLnqR9ifdN8qbVft@cluster0.lbvmb.mongodb.net/EchoVoyages2";

async function fixDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');

    // 1. Drop the unique index on contactInfo.email if it exists
    try {
      await mongoose.connection.db.collection('agencies').dropIndex('contactInfo.email_1');
      console.log('Dropped index on contactInfo.email');
    } catch (error) {
      console.log('No index to drop or error dropping index:', error.message);
    }

    // 2. Find all agencies with null contactInfo.email
    const agencies = await mongoose.connection.db.collection('agencies').find({
      $or: [
        { "contactInfo.email": null },
        { "contactInfo.email": { $exists: false } },
        { "contactInfo": null },
        { "contactInfo": { $exists: false } }
      ]
    }).toArray();

    console.log(`Found ${agencies.length} agencies with null contactInfo.email`);

    // 3. Update each agency
    for (const agency of agencies) {
      await mongoose.connection.db.collection('agencies').updateOne(
        { _id: agency._id },
        {
          $set: {
            "contactInfo": {
              "email": agency.gmail || `agency_${agency._id}@example.com`,
              "phone": agency.phno || ""
            }
          }
        }
      );
      console.log(`Updated agency: ${agency._id}`);
    }

    console.log('Database fix completed');
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixDatabase();
