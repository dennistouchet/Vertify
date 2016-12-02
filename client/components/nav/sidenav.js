import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';

import './sidenav.html';

Template.sidenav.onCreated(function(){
  //TODO: update side nav to be properly open according to current route

  // Reactively keeps track of the current route.
  Tracker.autorun(function(){
    var routeName = FlowRouter.getRouteName();
    //console.log("Current route is: " + routeName);
  });
});

Template.sidenav.helpers({
  navitems() {
    return Navitems.find({});
  },
  user_name(){
    return "Shia LeBeouf";
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
    $('.nav a.active').not(e.target).removeClass('active');
    $(e.target).toggleClass('active');
    var childMenuHeight = 0;
    childMenu = e.target.parentNode.childNodes[2];
    if(childMenu){
      childMenuHeight = childMenu.clientHeight;
    }
  },
});