import { Template } from 'meteor/templating';
import { Datas } from '../../../imports/collections/datas.js';
import { Navitems } from '../../../imports/collections/navitems.js';

import './test.html';

Template.test.onCreated(function(){
  Meteor.subscribe('datas', function(){
    console.log( "Test - Datas now subscribed.")
  });
  Meteor.subscribe('navitems', function (){
    console.log( "Test - Navitems now subscribed");
  });
});

Template.test.helpers({
  data(){
    return Datas;
  },
  datas() {
    return Datas.find({});
  },
  navitems() {
    return Navitems.find({});
  },
});

Template.test.rendered = function () {
  drawLineChart();
  drawDoughnutChart();
}

Template.test.events({

    'click' : function(){
      console.log('Test page click event');
    },
});

function drawDoughnutChart(){
  var options = {
    legend: true,
    responsive: false
  }

  var data = [
    {
        value: 50,
        color:"#27AE60",
        highlight: "#2ECC71",
        label: "trifft zu"
    },
    {
        value: 30,
        color: "#16A085",
        highlight: "#1ABC9C",
        label: "trifft eher zu"
    }
    ,
    {
        value: 20,
        color: "#53A085",
        highlight: "#1ABC9C",
        label: "trifft eher zu"
    }
  ]

  canvas = document.getElementById('donut');
  ctx = canvas.getContext('2d');

  var myNewChart = new Chart(ctx);

  new Chart(ctx).Doughnut(data, options);
}

function drawLineChart(){
  var data = {
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
      {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data : [65,59,90,81,56,55,40]
      },
      {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : [28,48,40,19,96,27,100]
      }
      ]
    }

    canvas = document.getElementById('line');
    ctx = canvas.getContext('2d');
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx);

    new Chart(ctx).Line(data);
}
