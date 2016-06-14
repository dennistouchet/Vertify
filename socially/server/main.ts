import {loadCollections} from './load-collections.ts';
import {Meteor} from 'meteor/meteor';

Meteor.startup(loadCollections);
