var multer = require('multer');

const { Brigade } = require('../brigade/models');
const { Fire } = require('../fire/models');
const { Chat } = require('../chat/models');
const { Item } = require('../geo/models');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId

/**
 * In root folder we need a upload folder with those folders inside:
 * brigade , fire , geo , user, chat
 */
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../../upload/${req.params.datafolder}/`);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var ext = file.originalname.split('.')[file.originalname.split('.').length -1];
        var filename=`${req.params.datafield}-${req.params.id}-${datetimestamp}.${ext}`;
        req.filename = filename;
        req.datalink = `/upload/${req.params.datafolder}/${filename}`;
        cb(null, filename);
    }
});

var uploadStorage = multer({ //multer settings
    storage: storage
}).single('uploads');


var removeFile = (link,cb=null)=>{
    //if(link.contains("http")) link=link.split("/")[0];
    fs.unlink(`${__dirname}/../..${link}`, (err) => {
        if (err) cb(false,err); // throw err;
        if(cb) cb(true); //console.log('successfully deleted /tmp/hello');
    });
}

storageAdd = (req,res,entity,model)=>{
    let field = req.params.datafield;
    if(!entity || !field) return res.sendStatus(404);
    uploadStorage(req,res,err=>{
      if(err){
            res.json({error_code:1,err_desc:err});
            return;
      }
      if(entity[field])removeFile(entity[field]);
      
      let find={_id: new ObjectId(entity._id)};
      let update = {$set: {}};
      entity[field] = update.$set[field]=req.datalink;

      model.update(find, update).then(d=>{
          if(d.ok) return res.json(entity);
          res.sendStatus(404);
      }).catch(e=>{
          res.status(500).json(e);
      });
      
    });
}


module.exports =  {storage, uploadStorage, removeFile, storageAdd};