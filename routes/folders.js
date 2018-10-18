'use strict';
const express = require('express');
const knex = require('../knex');

const router = express.Router();
////get all //////
router.get('/', (req, res, next) => {
    knex.select('id', 'name')
      .from('folders')
      .then(results => {
        res.json(results);
      })
      .catch(err => next(err));
  });
///////get by id ////
  router.get('/:id', (req, res, next) => {
    knex.select('id', 'name')
    .from('folders')
    .then(results => {
        res.json(results[0]);
    })
    .catch(err => next(err));
  })

  /////update //////
  router.put('/:id', (req, res, next) => {
    const foldersId = req.params.id;
    const { title, content } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!title) {
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    const updateItem = {
      title: title,
      content: content
    };
  
    knex('folders')
      .update(updateItem)
      .where('id', foldersId)
      .returning(['id', 'title', 'content'])
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

  ////////////////////////Create item ////////
  router.post('/', (req, res, next) => {
    const { title, content } = req.body;
  
    /***** Never trust users. Validate input *****/
    if (!title) {
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    const newItem = {
      title: title,
      content: content
    };
  
    knex.insert(newItem)
      .into('notes')
      .returning(['id', 'title', 'content'])
      .then((results) => {
        const result = results[0];
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => {
        next(err);
      });
  });

///////////////Delete Item /////////
router.delete('/:id', (req, res, next) => {
    knex.del()
      .where('id', req.params.id)
      .from('notes')
      .then(() => {
        res.status(204).end();
      })
      .catch(err => {
        next(err);
      });
  });






/////////////////////////////
  module.exports = router;