const exp = require('express');

const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const shopingRouter = require('./routes/shopingRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');
const productsRouter = require('./routes/productsRoutes');

const errorControllers = require('./controllers/errorControllers');
const appError = require('./utils/appError');

const rateLimit = require('express-rate-limit');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = exp();

//security
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, try again later',
});

// app.use('/api', limiter)

app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());
app.use(exp.json({ limit: '10Kb' }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// app.enable('trust proxy');
app.use(cors());
app.options('*', cors());
app.use(exp.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  console.log('working');
  res.send({ jason: 'working' });
});

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/reviews', reviewsRouter);
// app.use('/api/v1/shoping', shopingRouter);

app.all('*', (req, res, next) => {
  next(new appError(`can't find ${req.originalUrl}`, 404));
});

app.use(errorControllers);

module.exports = app;
