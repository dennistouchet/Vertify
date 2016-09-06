import { Template } from 'meteor/templating';

import './process.html';

Template.process.helpers({
});

Template.process.events({
  'click' : function(){
    console.log("process click event");
    //ModalHelper.openMatchConfirmModalFor(sysId);
  },
});
