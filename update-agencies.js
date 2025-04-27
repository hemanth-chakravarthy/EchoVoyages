// This script updates all agencies to ensure contactInfo is properly set
// You can run this in MongoDB Atlas Data Explorer

// Update all agencies to ensure contactInfo.email is set to gmail
db.agencies.updateMany(
  { $or: [
      { "contactInfo.email": null },
      { "contactInfo.email": { $exists: false } },
      { "contactInfo": null },
      { "contactInfo": { $exists: false } }
    ]
  },
  [
    { $set: { 
        "contactInfo": {
          "email": "$gmail",
          "phone": "$phno"
        }
      } 
    }
  ]
)

// Verify the changes
db.agencies.find({ "contactInfo.email": null }).count()
