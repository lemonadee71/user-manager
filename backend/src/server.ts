/* eslint-disable @typescript-eslint/no-unused-vars */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { z } from 'zod';
import { formatZodError } from './lib/zod.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TEST ONLY',
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// error handler
app.use(((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      error: err.name,
    });
  }

  if (err instanceof z.ZodError) {
    const details = formatZodError(err);

    res.status(422).json({
      success: false,
      message: details.error,
      error: err.name,
      details: details.fieldErrors,
    });
  }

  return res.status(500).json({
    success: false,
    message: (err as Error).message,
    error: 'Internal server error',
  });
}) as ErrorRequestHandler);

export default app;
