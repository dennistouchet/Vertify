import { Template } from 'meteor/templating';

import './process.html';

Template.process.helpers({
  incompleteMatch : function(){
    return true;
  }
});

Template.process.events({
  'click' : function(){
    console.log("process click event");
    //ModalHelper.openMatchConfirmModalFor(sysId);
  },
});
