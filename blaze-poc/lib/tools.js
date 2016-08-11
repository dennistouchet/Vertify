import { Meteor } from  "meteor/meteor";

Meteor.tools = {

  myAlert : function(msg) {
    alert(msg);

    if (msg == null){
      return false;
    }
    return true;
  },

  collectSimulation : function(records){

    return records;
  },
}
