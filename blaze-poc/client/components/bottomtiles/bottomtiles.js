import { Template } from 'meteor/templating';

import './bottomtiles.html';

Template.bottomtiles.helpers({

});

Template.bottomtiles.rendered = function () {

  drawDoughnutChart();
}

function drawDoughnutChart(){
  var options = {
    legend: false,
    responsive: false
  }

  var data = [
    {
        value: 50,
        color:"#3498DB",
        highlight: "#1498DB",
        label: "Converting"
    },
    {
        value: 30,
        color: "#1D6093",
        highlight: "#5D6093",
        label: "Syncing"
    }
    ,
    {
        value: 20,
        color: "#E81C57",
        highlight: "#A81C57",
        label: "Errors"
    }
  ]

  canvas = document.getElementById('canvas1');
  ctx = canvas.getContext('2d');

  var myNewChart = new Chart(ctx);

  new Chart(ctx).Doughnut(data, options);
}
