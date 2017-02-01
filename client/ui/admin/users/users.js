import { Template } from 'meteor/templating';
import { Workspaces } from '../../../../imports/collections/tenant/workspace.js';
import { Tenants } from '../../../../imports/collections/global/tenant.js';

import './users.html';

Template.users.onCreated(function(){
  this.autorun(()=>{
    this.subscribe('users', function(){
      console.log("Users - Users collection subscribed");
    });

    this.subscribe('roles', function(){
      console.log("Users - roles collection subscribed");
    });

    this.subscribe('tenants', function(){
      console.log("Users - tenants collection subscribed");
      var tnt = Tenants.findOne({'name': 'TestTenant1'});
      if(tnt){
        Session.set("currentTnt",tnt);
      }
    });
  });

  var tnt = Session.get("currentTnt");
  if(tnt)
    this.tenant_id = new ReactiveVar(tnt._id);
  else {
    this.tenant_id = new ReactiveVar("");
  }
});

Template.users.helpers({
  users(){
    us = Meteor.users.find({});
    return us;
  },
  tenant_id(){
    var tnt =  Session.get("currentTnt");
      if(tnt){
      return tnt._id;
    }
  }
});

Template.roleadministration.helpers({
  //TODO: limit to tenant UNLESS user is super-
  users(){
    us = Meteor.users.find({});
    return us;
  },
  roles(){
    //NOTE: this returns group and global roles
    //Limit to current tenant unless super- then split
    //get roles of each users by current tenant

    //get distinct roles
    var tnt =  Session.get("currentTnt");

    return Roles.getAllRoles();
  },
  userRoles: function(id){
    if(id){
      return Roles.getRolesForUser(id);
    }
  },
  userIsInRole: function(id, role){
    var tnt = Session.get("currentTnt");
    if(tnt){
      return Roles.userIsInRole(id, role, tnt._id);
    }
  },
  getFirstEmail: function(_id){
    var user = Meteor.users.findOne(_id);
    if(user){
      return user.emails[0].address;
    }
  }
});

Template.roleadministration.events({
  'click .rolecheckbox': function(e,t){
    console.log('clicked checkbox');
    if(e.target.checked){
      e.target.value = true;
    }else {
      e.target.value = false;
    }
  },
  'change input.rolecheckbox': function(e,t){
    var tnt = Session.get('currentTnt');
    console.log("this users roles groups: ", this.roles[tnt._id]);
    console.log("e.targ :", e.target);
  },
  'click .save' : function(e,t){
    //TODO: save all user roles data and update
    var tnt = Session.get('currentTnt');
    var ws = Session.get('currentWs');
    if(tnt && ws){
      //Verify user is admin before
      console.log("this id:", this._id);

      var users = Meteor.users.find();
      users.forEach( user =>{
          var rolesToAdd = [];
          var rolesToRemove = [];

          console.log('This us for user:',user._id);
          var rolecbs = $('input.rolecheckbox:checkbox:checked[data-value='+user._id+']');
          roles = [];
          if(rolecbs.length > 0){
            for(let i = 0; i < rolecbs.length; i++){
              rolesToAdd.push(rolecbs[i].name);
            }
          }
          //TODO call addusertoroles meteor here
          roles = [];
          var roleucbs = $('input.rolecheckbox:checkbox:not(:checked)[data-value='+user._id+']');
          if(roleucbs.length > 0){
            for(let i = 0; i < roleucbs.length; i++){
              rolesToRemove.push(roleucbs[i].name);
            }
          }
          Meteor.call('users.updateRoles', tnt._id, ws._id, user._id, rolesToAdd, rolesToRemove,
          (error, results)=>{
            if(error){
              console.log(error);
            }else{
              //success
            }
          });
      });


    }
  },
  'click .superadd' : function(e, t){
    console.log("this id:", this._id);
    Meteor.tools.userAddToGlobal(this._id,
      (err, res) => {
        if(err){
          console.log("error in adding user");
          return;
        }
        console.log("success in adding user");
    });
  },
  'click .superremove' : function(e, t){
    console.log("this id:", this._id);
  Meteor.tools.userRemoveFromGlobal(this._id,
      (err, res) => {
        if(err){
          console.log("error in removing user");
          return;
        }
        console.log("success in removing user");
    });
  }
});

Template.useradministration.helpers({
  users(){
    us = Meteor.users.find({});
    return us;
  },
  tenant_id(){
    var tnt =  Session.get("currentTnt");
      if(tnt){
      return tnt._id;
    }
  }
});

Template.user.helpers({
  userConfig: function(id){
    var user = Meteor.users.findOne({_id:id});
    if(user){
      return user.config;
    }
  },
  userRoles: function(id){
    var tnt = Session.get("currentTnt");
    if(tnt && id){
      return Roles.getRolesForUser(id, tnt._id);
    }
  },
  getFirstEmail: function(emailObj){
    if(emailObj){
      emailObj.verificationTokens.forEach(eobj => {
      });
      return emailObj.verificationTokens;
    }
  },
  getFirstPassword: function(passObj){
    if(passObj){
      return passObj.bcrypt;
    }
  },
  getWorkspaceName: function(ws_id){
    var ws = Workspaces.findOne(ws_id);
    if(ws)
      return ws.name;
  }
});

Template.user.events({
  'click .edit': function(e){
    e.preventDefault();
    Meteor.tools.userEdit(this._id, {}, {});
    console.log("Clicked user:", this._id);
    ModalHelper.openUserEditModalFor(this._id);
  },
  'click .editconfig': function(e){
    e.preventDefault();
    var errDiv = document.getElementById("addErrUser");
    //reset errors
    errDiv.innerHtml = '';
    errDiv.style.display = "none";

    var ws = Session.get('currentWs');
    if(ws){
      var config = {
        workspace: ws._id,
        route: FlowRouter.current().path
      };

      Meteor.tools.userConfigEdit(this._id, config);
      console.log("Clicked user:", this._id);
      ModalHelper.openUserEditConfigModalFor(this._id);
    }
    else{
      errDiv.style.display = 'block';
      errDiv.innerHTML = errDiv.innerHTML + '<li><span>Error:</span> No Workspace Selected.</li>';
    }
  },
  'click .delete': function(e){
    e.preventDefault();
    Meteor.tools.userRemove(this._id);
  },
});

Template.adduser.helpers({
  roles(){
    //NOTE: this returns group and global roles
    //Limit to current tenant unless super- then split
    //get roles of each users by current tenant

    //get distinct roles
    var tnt =  Session.get("currentTnt");

    return Roles.getAllRoles();
  },
});

Template.adduser.events({
  'click .rolemulti': function(e,t){

  },
  'click .save':function(e,t){
    console.log("save user stub");
  }
});
