import { Template } from 'meteor/templating';


Template.systemaddmodal.helpers({
});

Template.systemaddmodal.events({
  'click .sysinfoddl li a' : function(e, template){
    console.log("Object Event: " + e + " | Event Target: " + $(e.target));
    var btnprnt = $(e.target).parent().parent().parent();
    console.log("system ddl click event" + btnprnt[0] );

    var text = e.target.text;
    document.getElementById("text").value = text;
    document.getElementById("name").value = text;
    //change button text
    //var child = btnprnt.children('.btn')
    //child.html( text + ' <span class="caret"></span>') ;
  },
  'click #save': function(e) {
    e.preventDefault();

    //TODO: THIS CODE IS DUPLICATED IN CONNECT.JS UNDER 'click .add'
    //MAKE ANY NEW CHANGES THERE AS WELL
    //TODO:REFACTOR TO A SINGLE PLACE\
    var name = document.getElementById("name");
    var pf = document.getElementById("pf");
    var st = document.getElementById("st");
    var un = document.getElementById("un");
    var pw = document.getElementById("pw");
    var maxtasks = document.getElementById("maxtasks");

    // Gets the element selected by the system name added. Used to get "data-id" value
    var text = document.getElementById("text");
    var selectedItem = document.getElementById(text.value.trim());

    if(! Session.get("currentWsId")){
      alert("No Workspace Selected");
    }
    else if( (name.value === "")){
      alert("Missing System value.");
    }
    else if ( (pf.value === "")){
      alert("Missing prefix value.");
    }
    else if ( (st.value === "")){
      alert("Missing system value.");
    }
    else if ( (un.value === "")){
      alert("Missing username value.");
    }
    else if ( (pw.value === "")){
      alert("Missing password value.");
    }
    else if ( (maxtasks.value === "")){
      alert("Missing maxconcurrenttasks value.");
    }
    else if (selectedItem == null){
      alert("Error: issues with selected item");
    }
    else {
      var sysInfoId = selectedItem.getAttribute('data-value');
      var wsid = Session.get("currentWsId");

      //TODO: check if system values already exist (ie. name, prefix)
      console.log('name: ' + name.value  +' | ' + 'username: ' + un.value + ' | ' + 'system info id: ' +  sysInfoId);

      //TODO: value verification
      Meteor.call('systems.insert', wsid, sysInfoId, name.value.trim(), pf.value.trim()
      , st.value.trim(), un.value.trim(), pw.value.trim()
      , maxtasks.value.trim());

      Modal.hide('systemmodal');
    }
  }
});
