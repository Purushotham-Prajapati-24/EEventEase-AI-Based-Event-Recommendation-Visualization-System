3. Database Schema (MongoDB)
📦 Collections Overview
Users
Events
Registrations
👤 Users Collection
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "hashed_password",
  "interests": ["coding", "tech", "dance"],
  "createdAt": "timestamp"
}
🎉 Events Collection
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "tags": ["coding", "tech"],
  "date": "timestamp",
  "location": "string",
  "organizer": "string",
  "maxParticipants": 200,
  "registrationsCount": 120,
  "rating": 4.5,
  "createdAt": "timestamp"
}
📝 Registrations Collection
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "eventId": "ObjectId",
  "status": "registered / attended",
  "rating": 5,
  "createdAt": "timestamp"
}


Relationships
One User → Many Registrations
One Event → Many Registrations
Many-to-Many (Users ↔ Events via Registrations)
⚡ Indexing Strategy
email → unique index
tags → for fast filtering
date → for timeline queries