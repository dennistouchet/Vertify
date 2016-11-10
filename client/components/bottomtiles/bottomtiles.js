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
        color:"#40B8C8",
        highlight: "#9FDBE3",
        label: "Converting"
    },
    {
        value: 30,
        color: "#4F3A95",
        highlight: "#9588BF",
        label: "Syncing"
    }
    ,
    {
        value: 20,
        color: "#E81C57",
        highlight: "#F38DAB",
        label: "Errors"
    }
  ]

  canvas = document.getElementById('canvas1');
  ctx = canvas.getContext('2d');

  var myNewChart = new Chart(ctx);

  new Chart(ctx).Doughnut(data, options);
}
