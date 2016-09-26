import { Template } from 'meteor/templating';
import { VertifyObjects } from '../../../../imports/collections/tenant/vertify_object.js';
import { VertifyProperties } from '../../../../imports/collections/tenant/vertify_property.js'

import './process.html';

Template.alignprocess.helpers({
  hasObjects(){
    return false;
  },
  hasProperties(){
    return false;
  }
});


Template.alignprocess.events({

});
