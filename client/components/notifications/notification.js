Template.notifications.helpers({
  notifications(){
    var notifications = [{ _id: 1, msg:"Span Test", desc: "P Note description"}
    ,{ _id: 2, msg:"Span Test", desc: "P Note description"}
    ,{ _id: 3, msg:"Span Test", desc: "P Note description"}
    ,{ _id: 4, msg:"Span Test", desc: "P Note description"}];

    return notifications;
  },
});

Template.notification.helpers({
  isError: function(_id){
    return true;
  },
  isSuccess: function(_id){
    return true;
  },
  isWarn: function(_id){
    return true;
  },
  isNote: function(_id){
    return true;
  },
});
