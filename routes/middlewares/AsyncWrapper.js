/*
 * Copyright (c) 2017 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains the wrapper to wrap the async functions in express.
 *
 * @author TCSCODER
 * @version 1.0
 */

'use strict';

module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
