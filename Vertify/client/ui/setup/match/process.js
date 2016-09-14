import { Template } from 'meteor/templating';

import './process.html';

Template.process.helpers({
  properties(){
    //TODO: get vertify object properties
    return false;
  },
  incompleteMatch : function(){
    return true;
  }
});

Template.process.events({
  'click' : function(){
    console.log("process click event");
    //ModalHelper.openMatchConfirmModalFor(sysId);
  },
  'change input': function(e, t){
    //TODO: change this event so it only happens on the radio buttons and not other inputs
    console.log(e.target);
    var el = e.target.value;

    if(el === "criteria"){
      console.log("show filter");
      document.getElementById(("filterCriteria")).style.display = "inline";
    }
    else if(el === "count"){
      document.getElementById(("filterCriteria")).style.display = "none";
    }
  },
});
