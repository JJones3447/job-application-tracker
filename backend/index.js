require('dotenv').config();  
const express = require('express'); 
const cors = require('cors');
const app = express();

const db = require('./config/db'); 

const requiredEnv = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const jobRoutes = require('./routes/jobRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const jobInterviewRoutes = require('./routes/jobInterviewRoutes');
const authRoutes = require('./routes/authRoutes');

const errorHandler = require('./middleware/errorHandler');
const protect = require('./middleware/protect');


app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/jobs/:jobID/interviews', jobInterviewRoutes);
app.use('/authentication', authRoutes);
app.get('/', (req, res) => {
    res.send('Default route, everything should be okay');
});

app.all(/.*/, (req, res, next) => {
  const AppError = require('./utils/appError');
  next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404));
});
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});