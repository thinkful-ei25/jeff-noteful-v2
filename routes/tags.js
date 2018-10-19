'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

/////////////GET ALL ITEMS //////////////
router.get('/', (req, res, next) => {
  // const searchTerm = req.query.searchTerm;
  // const folderId = req.query.folderId;
console.log('Tags Here');
  knex.select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

///////get by id ////
router.get('/:id', (req, res, next) => {
  knex.select('id', 'name')
  .from('tags')
  .then(results => {
      res.json(results[0]);
  })
  .catch(err => next(err));
})


/* ========== POST/CREATE ITEM ========== */
router.post('/', (req, res, next) => {
    const { name } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    const newItem = { name };
  
    knex.insert(newItem)
      .into('tags')
      .returning(['id', 'name'])
      .then((results) => {
        // Uses Array index solution to get first item in results array
        const result = results[0];
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => next(err));
  });

//////////Delete //////////////
  router.delete('/:id', (req, res, next) => {
    knex.del()
      .where('id', req.params.id)
      .from('tags')
      .then(() => {
        res.status(204).end();
      })
      .catch(err => {
        next(err);
      });
  });


/////update //////
router.put('/:id', (req, res, next) => {
  const tagsId = req.params.id;
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = {
    name: name
  };

  knex('tags')
    .update(updateItem)
    .where('id', tagsId)
    .returning(['id', 'name'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});




  module.exports = router;