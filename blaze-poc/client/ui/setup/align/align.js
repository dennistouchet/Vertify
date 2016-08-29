import { Template } from 'meteor/templating';

import { ExternalObjects } from '../../../../imports/collections/tenant/external_object.js';


Template.align.helpers({

});


Template.align.events({

});


Meteor.subscribe('objects', function (){
  console.log( "Align - Objects now subscribed.");
});
