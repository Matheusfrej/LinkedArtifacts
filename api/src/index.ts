import dotenv from 'dotenv';
import { bootstrap } from './infrastructure/http/app';

dotenv.config();
bootstrap();
