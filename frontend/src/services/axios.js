import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
