import { Template } from 'meteor/templating';

import { Systems } from '../../../imports/collections/tenant/system.js';

Template.systemeditmodal.helpers({
  system: function(){
    var sysId = Session.get('selectedSystem');

    if(typeof sysId !== "undefined") {
      var system = Systems.findOne(sysId);
      return system;
    } else {
      return {name: '', pf:'', st: '', un:'', pw:'',maxtasks:''}
    }
  }
});

Template.systemeditmodal.events({

  'click #save': function(e) {
    e.preventDefault();

    //TODO: VERIFY WORKSPACE ID
    var sysId = Session.get('selectedSystem');

    var name = document.getElementById("name");
    var pf = document.getElementById("pf");
    var st = document.getElementById("st");
    var un = document.getElementById("un");
    var pw = document.getElementById("pw");
    var maxtasks = document.getElementById("maxtasks");

    //TODO: check if values are the same as initial values

    console.log('name: ' + name.value  +' | ' + 'username: ' + un.value + ' | ' + 'max conc tasks: ' +  maxtasks.value + ' |  system id: ' + sysId);

    if(sysId) {
      Meteor.call('systems.edit', sysId, name.value.trim(), pf.value.trim()
      , st.value.trim(), un.value.trim(), pw.value.trim()
      , parseInt(maxtasks.value) );
    } else {
      alert('Error: No system selected.')
    }

    //TODO: VALUE VERIFICATION

    Modal.hide('systemeditmodal');

  }
});

Meteor.subscribe('systems', function (){
  console.log( "Systemeditmodal - Systems now subscribed.");
});
