// This script checks for duplicate emails in the agencies collection
// You can run this in MongoDB Atlas Data Explorer

// Check for duplicate gmail values
db.agencies.aggregate([
  { $group: { _id: "$gmail", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])

// Check for duplicate contactInfo.email values
db.agencies.aggregate([
  { $group: { _id: "$contactInfo.email", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])

// Check for null contactInfo.email values
db.agencies.find({
  $or: [
    { "contactInfo.email": null },
    { "contactInfo.email": { $exists: false } },
    { "contactInfo": null },
    { "contactInfo": { $exists: false } }
  ]
}).count()
