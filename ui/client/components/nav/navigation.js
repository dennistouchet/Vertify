import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';
import './nav.html';


Template.nav.helpers({
  navitems() {
    return Navitems.find({});
  },
});

Template.nav.rendered = function(){
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
     isClosed = false;

  trigger.click(function () {
    hamburger_cross();
  });

  function hamburger_cross() {
    if (isClosed == true) {
      overlay.hide();
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
      isClosed = false;
    } else {
      overlay.show();
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
      isClosed = true;
    }
  }

  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });
}

Template.nav.events({
  'click' : function() {
      console.log("you clicked something in nav");
  },
  'click .dropdown-toggle': function(event){
      event.preventDefault();

      $(event.target).find('.dropdown-menu').toggle();
  }
});
