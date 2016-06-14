import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

/*
   NEEDED ON BOTH CLIENT AND SERVER
*/

People = new Mongo.Collection("people");


/*
   CLIENT SIDE
*/


if (Meteor.isClient) {

  // Set some default session values when starting up
  Meteor.startup(function() {
    Session.setDefault("sortby", "name");
    Session.setDefault("sortdir", 1);
  });

  console.dir(Template);

  Template.people.helpers({

    // The list of people, which can be sorted depending
    // on session values
    people: function() {
      var sortby = Session.get("sortby");
      var sortdir = Session.get("sortdir");
      var sort = {};
      sort[sortby] = sortdir;
      return People.find({}, {sort: sort});
    },

    // How many people there are
    numberPeople: function() {
      return People.find().count();
    },

    // Show the current plusones or zero if the property
    // doesn't exist
    plusones: function() {
      return this.plusones || 0;
    },

    // Hacky check to determine whether this item is the same
    // as the currently logged in user
    isMe: function() {
      if (!this.name) return false;
      return this.name.toLowerCase().indexOf(
        Meteor.user().profile.name.toLowerCase()) == 0;
    },

    // Whether to disable the +1 button if the current user
    // already voted for that person
    disabled: function() {
      return _.contains(this.voters, Meteor.user()._id)
        ? " disabled" : "";
    },

    // The currently sorted column
    sort: function() {
      return Session.get("sortby");
    },

    // Whether the current item is selected or not
    selected: function() {
      return Session.equals("selected", this._id)
        ? "selected" : "";
    },

    // Format a date to display when the last vote was added
    // for this person
    lastvote: function() {
      if (this.lastvote)
        return moment(this.lastvote).fromNow();
      return "never";
    },

    // Draw an arrow up or down depending on whether and how
    // we're sorting this column
    sortby: function(col) {
      if (Session.equals("sortby", col) &&
        Session.equals("sortdir", 1))
        return "&uarr;"
      else if (Session.equals("sortby", col) &&
        Session.equals("sortdir", -1))
        return "&darr;";
      else return "";
    },

    // Generate a shade of green depending on how many votes
    // the maximum upvoted user has
    bgc: function(plusones) {
      var max = People.findOne({}, {sort: {plusones: -1}})
        .plusones;
      max = max || 1;
      plusones = plusones || 0;
      var n = ~~(plusones / max * 100 + 155);
      var c = [Math.max(0, n - 80), n, Math.max(0, n - 80)]
        .join(",")
      return "background: rgb(" + c + ")";
    }

  });

  // Define some events for the people template
  Template.people.events({
    'click .button': function() {
      // Call the server method "plusone" with the current
      // person's id when we click the +1 button
      Meteor.call("plusone", this._id);
    },
    'click tbody tr': function() {
      // Select the current item when we click it
      Session.set('selected', this._id);
    },
    'click thead th': function(evt) {
      // Sort by the column we just clicked, or reverse the
      // sort order if already sorting by it
      Session.set("sortby",
        evt.target.getAttribute("data-sortby"));
      Session.set("sortdir", Session.get("sortdir") * -1);
    }
  });

}


/*
  FACEBOOK LOGIN FUNCTIONS
*/
Template.login.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
    },

    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
});


/************************/
/* DEMO UTILITY METHODS */
/************************/

  Meteor.methods({
    empty: function() {
      People.remove({});
    },
    reset: function() {
      People.remove({});

      // Prefill the database with people who signed up for this talk :)
      var people = [
        "Albert Netymk",
        "Albin Larsson",
        "Anton Malmberg",
        "Asma Rafiq",
        "Bas Kloppenborg",
        "CalleR",
        "Carl Byström",
        "Christian Nygaard",
        "Hesham",
        "Håkan Rosenhorn",
        "Johan Althoff",
        "Johan Andersson",
        "Johan Olsson",
        "Jonathon Walker",
        "Karl Pokus",
        "kenny duong",
        "Kim Carlbäcker",
        "Kvadratrot",
        "Linus Österberg",
        "Marcus Ekwall",
        "Mathias Anderssén",
        "Oskar Flordal",
        "paer Henrikxon",
        "Peramanathan Sathyamoorthy",
        "Rahul Choudhury",
        "Richard Norqvist"
      ];

      _.each(people, function(person) {
          People.insert({
            name: person,
            plusones: 0,
            voters: []
          });
      });
    }
  });
