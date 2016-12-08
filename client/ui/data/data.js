import { Template } from 'meteor/templating';
import { Navitems } from '../../../imports/collections/navitems.js';
import './data.html';

Template.data.onCreated(function(){
  Meteor.subscribe('navitems', function (){
    console.log( "Data - Navitems now subscribed");
  });
});

Template.data.helpers({
  navitems() {
    return Navitems.find({});
  },
  isData : function(name){
    //alert('inside isname function: ' + name);
    if(name === 'Data'){
      return true;
    }
    else {
      return false;
    }
  }
});
