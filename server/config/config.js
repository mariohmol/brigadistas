require('dotenv').config();
exports.ENV = process.env.DATABASE_URL || "production";
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ? 'mongodb://localhost/brigadistas' : 'mongodb://localhost/brigadistas');
exports.PORT = process.env.PORT || 8484;
exports.DONTREPLY_EMAIL= process.env.DONTREPLY_EMAIL || 'emaildontreply@brigadistacivil.com.br';
exports.ADMIN_EMAIL=process.env.ADMIN_EMAIL || 'administrators@brigadistacivil.com.br';
exports.SMTP_HOST=process.env.SMTP_HOST || 'SES_SMTP_URL';
exports.SMTP_PORT=process.env.SMTP_PORT || '465';
exports.SMTP_USER=process.env.SMTP_USER || 'USER';
exports.SMTP_PASS=process.env.SMTP_PASS || 'PASS';
