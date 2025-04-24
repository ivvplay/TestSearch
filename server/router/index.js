const dataController = require("../controllers/data-controller");
const Router = require('express').Router;
router = new Router();


router.get('/items',(req, res) => dataController.getItems(req, res))
router.put('/items_sort', (req, res) => dataController.updateItems(req, res))

module.exports = router;
