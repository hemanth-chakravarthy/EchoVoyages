// Run this in MongoDB Atlas Data Explorer

// 1. First, remove the unique index on contactInfo.email if it exists
db.agencies.dropIndex("contactInfo.email_1");

// 2. Find all agencies with null contactInfo.email
var agenciesWithNullEmail = db.agencies.find({
  $or: [
    { "contactInfo.email": null },
    { "contactInfo.email": { $exists: false } },
    { "contactInfo": null },
    { "contactInfo": { $exists: false } }
  ]
}).toArray();

print("Found " + agenciesWithNullEmail.length + " agencies with null contactInfo.email");

// 3. Update each agency
agenciesWithNullEmail.forEach(function(agency) {
  db.agencies.updateOne(
    { _id: agency._id },
    { 
      $set: { 
        "contactInfo": {
          "email": agency.gmail || "agency_" + agency._id + "@example.com",
          "phone": agency.phno || ""
        }
      } 
    }
  );
  print("Updated agency: " + agency._id);
});

print("Database fix completed");
