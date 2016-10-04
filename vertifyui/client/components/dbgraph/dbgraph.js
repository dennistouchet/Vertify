import { Template } from 'meteor/templating';

import './dbgraph.html';

Template.dbgraph.helpers({
  createChart: function () {
    // Setup Data
    var allTasks = 35,
        incompleteTasks = 6,
        errorTasks = 3,
        tasksData = [{
          y: incompleteTasks,
          name: "Converting",
          color: '#1D6093'
        }, {
          y: allTasks - (incompleteTasks + errorTasks),
          name: "Syncing",
          color: '#369DD8'
        },{
          y: errorTasks,
          name: "Errors",
          color: '#E81C57'
        }];
    // Use Meteor.defer() to create charter after DOM is ready
    Meteor.defer(function() {
      // Create standard Highcharts chart after DOM is ready
      Highcharts.chart('hchart', {
        series: [{
          type: 'pie',
          data: tasksData,
          innerSize: '45%',
        }],
        title: {
          text: 'Objects',
          align: 'left'
        },
        subtitle:{
          text: 'Total System Objects',
          align: 'left'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                }
            }
        },
      });
    });
  },
});

Template.dbgraph.rendered = function(){
  drawDoughnutChart();
}


function drawDoughnutChart(){
  var mockVar = "mockVar";
}