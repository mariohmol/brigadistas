require('dotenv').config();
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ? 'mongodb://localhost/brigadistas' : 'mongodb://localhost/brigadistas');
exports.PORT = process.env.PORT || 8484;
exports.DONTREPLY_EMAIL= process.env.DONTREPLY_EMAIL || 'emaildontreply@brigadistacivil.com.br';
exports.ADMIN_EMAIL=process.env.ADMIN_EMAIL || 'administrators@brigadistacivil.com.br';
exports.SMTP_URL=process.env || 'smtp://ENCODED_USER:ENCODED_PASS@SES_SMTP_URL:465';
