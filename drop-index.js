// This is a simple script to drop the unique index on contactInfo.email
// You can run this in MongoDB Atlas Data Explorer

// Check existing indexes
db.agencies.getIndexes()

// Drop the problematic index
db.agencies.dropIndex("contactInfo.email_1")

// Verify indexes after dropping
db.agencies.getIndexes()
