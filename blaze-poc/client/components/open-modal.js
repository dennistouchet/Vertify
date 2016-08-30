
ModalHelper = {};

ModalHelper.openSysAddModalFor = function(){
  Modal.show('systemaddmodal');
}

ModalHelper.openSysEditModalFor = function(sysId){
  Session.set('selectedSystem', sysId);
  Modal.show('systemeditmodal');
}


ModalHelper.openWsAddModalFor = function(){
  Modal.show('wsaddmodal');
}

ModalHelper.openWsEditModalFor = function(wsId){
  Session.set('selectedWorkspace', wsId);
  Modal.show('wseditmodal');
}