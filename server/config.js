exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ? 'mongodb://localhost/brigadistas' : 'mongodb://localhost/brigadistas');
exports.PORT = process.env.PORT || 8484;
