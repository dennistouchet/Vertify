import { Datas } from '../imports/collections/datas.js';

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.DataList = new Tabular.Table({
  name: "DataList",
  collection: Datas,
  columns: [
    {data: "name", title: "Name", class: "col-md-1"},
    {data: "number", title: "Number", class: "col-md-1"},
    {data: "email", title: "Email", class: "col-md-3"},
    {data: "description", title: "Description", class: "col-md-4"}
  ]
});
