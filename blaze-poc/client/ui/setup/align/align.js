import { Template } from 'meteor/templating';

import { Objects } from '../../../../imports/collections/tenant/object.js';


Template.align.helpers({

});


Template.align.events({

});


Meteor.subscribe('objects', function (){
  console.log( "Align - Objects now subscribed.");
});
