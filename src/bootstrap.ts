import dotenv from 'dotenv';

process.env.NODE_ENV = 'production';
process.env.NEXT_SHARP_PATH = require.resolve('sharp');
dotenv.config({ path: '.env' });
