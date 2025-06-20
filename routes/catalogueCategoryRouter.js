const router = require("express").Router();
const catalogueCategoryController = require("../controllers/catalogueCategoryController");
const catalogueCategoryValidationSchema = require("../apiValidationSchemas/catalogueCategoryValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(catalogueCategoryValidationSchema.create),
  catalogueCategoryController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(
    catalogueCategoryValidationSchema.findById
  ),
  catalogueCategoryController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(catalogueCategoryValidationSchema.findAll),
  catalogueCategoryController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(
    catalogueCategoryValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(catalogueCategoryValidationSchema.update),
  catalogueCategoryController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(
    catalogueCategoryValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(catalogueCategoryValidationSchema.findById),
  catalogueCategoryController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    catalogueCategoryValidationSchema.deleteMultiple
  ),
  catalogueCategoryController.deleteMultiple
);

module.exports = router;
