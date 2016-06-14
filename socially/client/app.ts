import 'reflect-metadata';
import { Component }   from  '@angular/core';
import { bootstrap }   from  'angular2-meteor-auto-bootstrap'
import { Items }       from  '../collections/items';
import { Parties }     from  '../collections/parties';
import { Mongo }       from  'meteor/mongo';
import { PartiesForm } from './imports/parties-form/parties-form';

@Component({
  selector: 'app',
  templateUrl: '/client/app.html',
  directives: [PartiesForm]
})

class Socially {
  items: Mongo.Cursor<Object>;
  parties: Mongo.Cursor<Object>;

  constructor() {
    this.items = Items.find();
    this.parties = Parties.find();
  }

  removeParty(party){
    Parties.remove(party._id);
  }
}

bootstrap(Socially);
