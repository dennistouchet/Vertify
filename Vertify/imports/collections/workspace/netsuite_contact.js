import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const NetsuiteContact = new Mongo.Collection('netsuite_contact');

NetsuiteContact.schema = new SimpleSchema({

  "metadata.$.id":
    { type: String },
  "metadata.$.is_original":
    { type: Boolean },
  "metadata.$.is_created":
    { type: Boolean },
  "metadata.$.is_uploaded":
    { type: Boolean },
  "metadata.$.is_error":
    { type: Boolean },
  "metadata.$.error_Text":
    { type: String },
  "metadata.$.fields_to_null":
    { type: String },
  "metadata.$.created":
    { type: Date },
  "metadata.$.modified":
    { type: Date },
  "metadata.$.last_collected":
    { type: Date },
  "metadata.$.ignore":
    { type: Boolean },
  "links.$.object_id":
    { type: String },
  "links.$.id":
    { type: String },
  "data.$.internalId":
    { type: String },
  "data.$.firstname":
    { type: String },
  "data.$.lastname":
    { type: String },
  "data.$.middlename":
    { type: String },
  "data.$.phone":
    { type: String },
  "data.$.website":
    { type: String },
  "data.$.email":
    { type: String },
  "data.$.company.interalId":
    { type: String },
  "data.$.addressbookList.addressbook.$.addr1"
    { type: String },
  "data.$.addressbookList.addressbook.$.addr2"
    { type: String },
  "data.$.addressbookList.addressbook.$.city"
    { type: String },
  "data.$.addressbookList.addressbook.$.state"
    { type: String },
  "data.$.addressbookList.addressbook.$.zip"
    { type: String },
  "data.$.customFieldList.$.internalId"
    { type: String },
  "data.$.customFieldList.$.scriptId"
    { type: String },
  "data.$.customFieldList.$.value"
    { type: String },
  "data.$.contactStatus.internalId"
    { type: String },
  "data.$.pricingMatrix.$.pricing.$.priceLevel.internalId"
    { type: String },
  "data.$.pricingMatrix.$.pricing.$.currency.internalId"
    { type: String },
  "data.$.pricingMatrix.$.pricing.$.priceList.quantity"
    { type: String },
  "data.$.pricingMatrix.$.pricing.$.priceList.value"
    { type: Number }
});
