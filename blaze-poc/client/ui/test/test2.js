import { Template } from 'meteor/templating';

import './test2.html';

Template.test2.helpers({
  kvp() {
    var kvpairs = [];

    Object.keys(Session.keys).forEach( function(k){
      kvpairs.push({
        key: k,
        value: Session.get(k)
      })
    });

    return kvpairs;
  },
});
