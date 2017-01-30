import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Datas = new Mongo.Collection('datas');

Meteor.methods({
  'datas.insert'(){
    check(n, String);
    check(no, Number);
    check(e, String);
    check(d, String);

    //check user is logged
    /*
    if(! this.userId) {
      throw new Meteor.Error(500, 500, 'not-authorized');
    }
    */
    var newDatas = {
      name: n,
      number: no,
      email: e,
      description: d,
    };

    Data.schema.validate(newDatas);
    Datas.insert(newDatas);
  },
  'datas.remove'(currentid){
    var current = Datas.findOne(currentid);
    Datas.remove(current._id);
  },
  'datas.edit'(id, n, no, e, d){
    check(n, String);
    check(no, Number);
    check(e, String);
    check(d, String);

    Datas.update(id, {$set: {name: n, number: no, email: e, description: d}});
  },
});

Datas.attachSchema(new SimpleSchema({
  name:
    { type: String },
  number:
    { type: Number},
  email:
    { type: String},
  description:
    { type:String }
}));

Datas.allow({
  insert: function(){
    return true;
  }
});
