Meteor core's setup has:

*real-time reactivity through web sockets
*two databases. One on the client for fast changes, another behind the server for official changes.
*a special protocol (called DDP) that synchronizes data between two databases.
*a bunch of small things that make creating an app with Meteor easier and more developer friendly!

-- Expansion on core features:

*Two databases.
	**mongoDB (server) and miniMongo (client)
	**handle data in meteor through the Mongo.Collection class, which works on both the server and client.

*DDP-distributed bata protocol
	**supports two operations
	**remote calls by client to server
	**client subscription to documents (published by the server) which the client will be informed about by the server when the documents are updated.
	**uses either SockJS or Websockets for lowlevel message transport
	** ping - pong communication (possibily with id)

MONGO console commands:

To run:
	*meteor mongo

Insert object:
	*db.[object-name].insert({ field: "value" });

Find object (with DB _id):
	*db.[object-name].find({});

Remove object:
	*db.[object-name].remove({ "_id": ObjectId("575f0b75f4e58e92014e8d87") });

#mongo generate collection objects _id's are created as object idsex: Objects("jknsdfg87sdbhijn")
where as meteor mongo generate id's are prng STRING _ids
