// This script should be run directly in MongoDB shell to fix the database issues

// 1. First, remove the unique index on contactInfo.email if it exists
db.agencies.dropIndex("contactInfo.email_1");

// 2. Update all agencies to ensure contactInfo.email is set
db.agencies.find().forEach(function(agency) {
  if (!agency.contactInfo || !agency.contactInfo.email) {
    db.agencies.updateOne(
      { _id: agency._id },
      { 
        $set: { 
          "contactInfo.email": agency.gmail || "agency_" + agency._id + "@example.com",
          "contactInfo.phone": agency.phno || ""
        } 
      }
    );
    print("Updated agency: " + agency._id);
  }
});

// 3. Create a new unique index on gmail instead
db.agencies.createIndex({ "gmail": 1 }, { unique: true });

print("Database fix completed");
