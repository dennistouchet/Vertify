import { Datas } from '../imports/collections/datas.js';
import { FixUnmatchedRecords } from "../imports/collections/workspace/unmatched_record.js";
import Tabular  from 'meteor/aldeed:tabular';

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

TabularTables.FixUnmatchedRecords = new Tabular.Table({
  name: "FixUnmatchedRecords",
  collection: FixUnmatchedRecords,
  columns: [
    {data: "_id", title: "ID", class: "col-md-3"},
    {data: "name", title: "Name", class: "col-md-3"},
    {data: "value", title: "Email", class: "col-md-3"}
  ]
});

export { TabularTables }
