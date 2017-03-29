var multer = require('multer');

/**
 * In root folder we need a upload folder with those folders inside:
 * brigade , fire , geo , user, chat
 */
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../../uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var uploadStorage = multer({ //multer settings
    storage: storage
}).single('file');


module.exports =  {storage, uploadStorage};