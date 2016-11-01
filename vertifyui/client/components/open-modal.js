
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

ModalHelper.openMatchConfirmModalFor = function(id, mrid){
  Session.set('selectedVertifyObject', id);
  Session.set('selectedMatchResultId', mrid);
  Modal.show('matchconfirmmodal');
}

ModalHelper.openAlignConfirmModalFor = function(id, arid){
  Session.set('selectedVertifyObject', id);
  Session.set('selectedAlignResultId', arid);
  Modal.show('alignconfirmmodal');
}

ModalHelper.openAnalysisConfirmModalFor = function(id){
  Session.set('analyzeVertifyObject', id);
  Modal.show('analyzeconfirmmodal');
}

ModalHelper.openFixConfirmModalFor = function(type){
  Session.set('fixType', type);
  Modal.show('fixconfirmmodal');
}
