import { SystemInfos } from '../../../../imports/collections/global/system_info.js';

import './connect.html';

Template.addsystem.helpers({
  system_info(){
    return SystemInfos.find({});
  },
}); 
