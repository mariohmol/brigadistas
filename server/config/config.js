require('dotenv').config();
exports.ENV = global.ENV || process.env.ENV || "production";
exports.DATABASE_URL = global.DATABASE_URL || process.env.DATABASE_URL || global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ? 'mongodb://localhost/brigadistas' : 'mongodb://localhost/brigadistas');
exports.PORT = global.PORT || process.env.PORT || 8484;
exports.URL = process.env.URL || 'https://brigadistacivil.com.br';
exports.DONTREPLY_EMAIL= process.env.DONTREPLY_EMAIL || 'emaildontreply@brigadistacivil.com.br';
exports.ADMIN_EMAIL=process.env.ADMIN_EMAIL || 'administrators@brigadistacivil.com.br';
exports.SMTP_HOST=process.env.SMTP_HOST || 'SES_SMTP_URL';
exports.SMTP_PORT=process.env.SMTP_PORT || '465';
exports.SMTP_USER=process.env.SMTP_USER || 'USER';
exports.SMTP_PASS=process.env.SMTP_PASS || 'PASS';
exports.APN_KEYID=process.env.APN_KEYID || 'T0K3NK3Y1D';
exports.APN_TEAMID=process.env.APN_TEAMID || 'T34M1D';
exports.ANDROID_GCMKEY=process.env.ANDROID_GCMKEY || 'YOUR_API_KEY_HERE';
exports.APN_PATHKEY=process.env.APN_PATHKEY || "server/config/ios.p8";
