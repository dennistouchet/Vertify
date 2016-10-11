import { Meteor } from  "meteor/meteor";
import { Systems } from "../imports/collections/tenant/system.js";
import { Connectors } from '../imports/collections/global/connectors.js';
import { ExternalObjects } from "../imports/collections/tenant/external_object.js";
import { MatchSetup } from "../imports/collections/tenant/match_setup.js";
import { VertifyObjects } from "../imports/collections/tenant/vertify_object.js";
import { VertifyProperties } from '../imports/collections/tenant/vertify_property.js';

Meteor.tools = {
  CapitalizeFirstLetter : function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  },
  myAlert : function(msg) {
    alert(msg);

    if (msg == null){
      return false;
    }
    return true;
  },
  getExternalObjects : function(wsid, sysid){
    console.log("getExternalObjects Called from tools.js");

    var netsuiteExternalObjects = [{
          name: "Netsuite Customer",
          is_dynamic: false
        },{
          name: "Netsuite Object",
          is_dynamic: false
        }];

    var marketoExternalObjects = [{
          name: "Marketo LeadRecord",
          is_dynamic: true
        },{
          name: "Marketo Agent",
          is_dynamic: true
        },{
          name: "Market Object",
          is_dynamic: true
        }];

    var salesforceExternalObjects = [{
          name: "Salesforce User",
          is_dynamic: true
        },{
          name: "Salesforce Customer",
          is_dynamic: true
        }];


    var extobj = null;
    var system = Systems.findOne({"workspace_id": wsid, "id": sysid});
    if(system){
      var connector = Connectors.findOne({"id": system.connector_id});
      if(connector.id == 100000){
        extobj = netsuiteExternalObjects;
      }
      else if (connector.id == 111111){
        extobj = marketoExternalObjects;
      }
      else if (connector.id == 222222){
        extobj = salesforceExternalObjects;
      }
    }
    return extobj;
  },
  connectStatus : function(wsid){
    var systemCount = Systems.find({"workspace_id": wsid}).count();
    if(systemCount > 1)
    {
      return true;
    }
    return false;
  },
  collectStatus : function(wsid){
    var externalObjectCount = ExternalObjects.find({"workspace_id": wsid}).count();
    if(this.connectStatus(wsid) && (externalObjectCount > 1))
    {
      return true;
    }
    return false;
  },
  matchStatus : function(wsid){
    //TODO: adjust to be more precise
    var complete = false;
    var vertifyObjectsExist = VertifyObjects.find({"workspace_id": wsid});
    if(this.collectStatus(wsid) && vertifyObjectsExist){

      vertifyObjectsExist.forEach(function(vo){

        var voextobj = vo.external_objects;
        console.log(voextobj);
        if(voextobj){
          voextobj.forEach(function(voeo){
            if(voeo.approved) complete = voeo.approved;
          });
        }
      });
    }
    return complete;
  },
  alignStatus : function(wsid){
    var complete = false;
    var vertifyPropertiesExist = VertifyProperties.find({"workspace_id": wsid});
    if(this.matchStatus(wsid) && vertifyPropertiesExist){

      vertifyPropertiesExist.forEach(function(vp){
        var vpextobj = vp.external_objects;
        if(vpextobj){
        vpextobj.forEach(function(vpeo){
          if(vpeo.approved) complete = vpeo.approved;
        });
      }
      });
    }
    return complete;
  },
  setupStatus : function(wsid, status){
    if(status == "Connect"){
      return this.connectStatus(wsid);
    }
    else if(status == "Collect"){
      return this.collectStatus(wsid);
    }
    else if(status == "Match"){
      return this.matchStatus(wsid);
    }
    else if(status == "Align"){
      return this.alignStatus(wsid);
    }
    else{
      return false;
    }
  },
  randomUUID : function(){
    var date = new Date().getTime();
    // user higher precision if available
    if(window.performance && typeof window.performance.now === "function"){
      date += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
      var rand = (date + Math.random()*16)%16 | 0;
      date = Math.floor(date/16);
      return (char=='x' ? rand : (rand&0x3|0x8)).toString(16);
    });
    return uuid;
  },
  taskRunner : function(wsid, objectid, tasktype, other){

  },
  getQueryParamByName: function(name, url){
    if(!url)
      url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);

    if(!results) return null;
    if(!results[2]) return '';
    console.log(name);
    console.log(results);
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
  convertMatchSetuptoVertifyObj : function(wsid, msid){
    console.log("Convert values = wsid: " + wsid + " | msid: " + msid );

    //TODO: Check Vertify object with current External Object doesn't already exist.

    MatchObject = MatchSetup.findOne({"id": msid, "workspace_id": wsid});
    if(MatchObject){
      //Create new VO
      if(MatchObject.new_object){

          Meteor.call('vertify_objects.insert', MatchObject);

      }//Update Existing VO
      else{
          Meteor.call('vertify_objects.update', MatchObject);
      }
    }
    else{
      throw new Meteor.Error("Error","Error Retrieving Match Setup Object");
    }
  },
  proceedToNextStep : function (t, step){
    t.currentTab.set( step );

    var tabs = $(".nav-pills li");
    tabs.removeClass("active");

    var currentTab = $("ul").find("[data-template='" + step + "']");
    currentTab.addClass("active");
  },
}

/*
var CURRENT_URL = window.location.href.split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
$(document).ready(function() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function(ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }

            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function() {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function(){
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel:{ preventDefault: true }
        });
    }
});
// /Sidebar
*/
