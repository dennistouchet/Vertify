import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';

import './sidenav.html';

Template.sidenav.onCreated(function(){

});

Template.sidenav.helpers({
  navitems() {
    return Navitems.find({});
  },
  user_name(){
    // TODO: currently just splits emails
    // should be updated once users name added to user collection
    let usr = Meteor.user().emails[0].address.split('@');
    return usr[0] + ' ' + usr[1].split('.')[0];
  }
});

Template.sidenav.events({
  'click' : function() {
      console.log("you clicked something in nav");
  },
  'click .dropdown-toggle': function(event){
      event.preventDefault();

      $(event.target).find('.dropdown-menu').toggle();
  },
  'click .nav li a': function(e){
    //if
    $('.nav a.active').not(e.target).removeClass('active');
    $(e.target).toggleClass('active');
    var childMenuHeight = 0;
    childMenu = e.target.parentNode.childNodes[2];
    if(childMenu){
      childMenuHeight = childMenu.clientHeight;
    }
  },
});
