var express = require('express');
var router = express.Router();

const TableMatrixes = [{"matrix":[[{"color":"white"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"}],[{"color":"white"},{"color":"green"},{"color":"white"},{"color":"green"},{"color":"green"},{"color":"green"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"}],[{"color":"green"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"green"},{"color":"white"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"}],[{"color":"white"},{"color":"green"},{"color":"green"},{"color":"green"},{"color":"green"},{"color":"green"},{"color":"green"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"}],[{"color":"white"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"white"}],[{"color":"white"},{"color":"green"},{"color":"white"},{"color":"green"},{"color":"white"},{"color":"green"},{"color":"white"},{"color":"blue"},{"color":"blue"},{"color":"blue"},{"color":"white"},{"color":"white"}],[{"color":"white"},{"color":"green"},{"color":"green"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"white"},{"color":"blue"},{"color":"white"},{"color":"white"},{"color":"white"}],[{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"blue"},{"color":"blue"},{"color":"blue"},{"color":"blue"},{"color":"white"}],[{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"white"},{"color":"white"},{"color":"white"}],[{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"white"},{"color":"blue"},{"color":"white"},{"color":"blue"},{"color":"white"}],[{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"white"},{"color":"white"},{"color":"blue"}],[{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},{"color":"blue"},{"color":"blue"},{"color":"white"},{"color":"white"},{"color":"white"}]]},
]

router.get('/load', function(req, res, next) {
  const { type } = req.query;
  res.json({
    message: 'Cube data loaded successfully',
    matrixes: TableMatrixes
  });
});

router.post('/save', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
