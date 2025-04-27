// Script to fix agency schema issues
import mongoose from 'mongoose';
import { Agency } from './backend/models/agencyModel.js';

const mongoURL = "mongodb+srv://saiananyakatakam:NLnqR9ifdN8qbVft@cluster0.lbvmb.mongodb.net/EchoVoyages2";

async function fixAgencySchema() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');

    // Find all agencies
    const agencies = await Agency.find({});
    console.log(`Found ${agencies.length} agencies`);

    // Check for agencies with null contactInfo.email
    const agenciesWithNullEmail = agencies.filter(agency => 
      !agency.contactInfo || !agency.contactInfo.email
    );
    
    console.log(`Found ${agenciesWithNullEmail.length} agencies with null contactInfo.email`);

    // Update agencies with null contactInfo.email
    for (const agency of agenciesWithNullEmail) {
      console.log(`Updating agency: ${agency._id}`);
      
      // Set contactInfo.email to gmail if available, or a unique value
      const email = agency.gmail || `agency_${agency._id}@example.com`;
      
      // Update using updateOne to bypass schema validation
      await mongoose.connection.collection('agencies').updateOne(
        { _id: agency._id },
        { 
          $set: { 
            'contactInfo.email': email,
            'contactInfo.phone': agency.phno || ''
          } 
        }
      );
      
      console.log(`Updated agency: ${agency._id}`);
    }

    console.log('All agencies updated successfully');
    
    // Drop the unique index on contactInfo.email if it exists
    try {
      await mongoose.connection.collection('agencies').dropIndex('contactInfo.email_1');
      console.log('Dropped unique index on contactInfo.email');
    } catch (error) {
      console.log('No index to drop or error dropping index:', error.message);
    }

    console.log('Database fix completed');
  } catch (error) {
    console.error('Error fixing agency schema:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixAgencySchema();
