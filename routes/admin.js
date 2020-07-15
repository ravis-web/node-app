const express = require('express');

const prodCtrl = require('../controllers/prodControl');

// express-router
const router = express.Router();

router.get('/products', prodCtrl.fetchProds);
router.get('/add-prod', prodCtrl.addProd);
router.get('/edit-prod/:id', prodCtrl.editProd);

router.post('/save-prod', prodCtrl.saveProd);
router.post('/updt-prod', prodCtrl.updtProd);
router.post('/delt-prod', prodCtrl.deltProd);

exports.routes = router;
// module.exports = router;


/* --- serve static ---
const path = require('path');
const appDir = require('../utils/abs-path');

res.sendFile(
  path.join(appDir, 'views', 'add-prod.html')
);
*/
