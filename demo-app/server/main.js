import { Meteor } from 'meteor/meteor';


/*
   NEEDED ON BOTH CLIENT AND SERVER
*/
People = new Mongo.Collection("people");


/*
   SERVER SIDE
*/


if (Meteor.isServer) {

  // Define some access rights for the People collection
  People.allow({
    // Allow all inserts
    insert: function() { return true; },

    // only allow updates that increment plusones by 1 and
    // disallow upvoting yourself
    update: function(userId, docs, fields, modifier) {
      var isMe = docs[0].name.toLowerCase() ===
        Meteor.user().profile.name.toLowerCase();
      var isPlusOne = _.keys(modifier).length == 1
        && modifier["$inc"] && modifier["$inc"].plusones == 1;
      return isPlusOne && !isMe;
    }
  });

  // Watch the People collection and act if a change matches
  // our observer
  People.find({}).observe({
    changed: function(newDoc, atIndex, oldDoc) {
      // If a person is upvoted beyond 42 upvotes, send Rahul
      // an email :)
      if (newDoc.plusones >= 42 && oldDoc.plusones < 42) {
        Email.send({
          to: "dtouchet@thenewoffice.com",
          from: "dtouchet@thenewoffice.com",
          subject: "Someone reached +42!",
          text: newDoc.name +
            " reached +42 votes in the Meteor Demo! W000000t"
        });
      }
    }
  });

  // Define some API methods that the client can use
  Meteor.methods({
    // Plusone a person by ID. Doesn't do anything if the
    // current user already voted for this person.
    plusone: function(id) {
      var record = People.findOne(id);
      if (_.contains(record.voters, Meteor.user()._id))
        return;
      People.update(id, {
        $inc: {plusones: 1},
        $addToSet: {voters: Meteor.user()._id},
        $set: {lastvote: new Date()}
      });
    }
  });
}
