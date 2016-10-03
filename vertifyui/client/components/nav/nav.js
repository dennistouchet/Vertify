import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';
import './nav.html';


Template.navigation.helpers({
  navitems() {
    return Navitems.find({});
  },
});

Template.navigation.events({
  'click' : function() {
      console.log("you clicked something in nav");
  },
  'click .dropdown-toggle': function(event){
      event.preventDefault();

      $(event.target).find('.dropdown-menu').toggle();
  }
});
