const router = require("express").Router();
const catalogueController = require("../controllers/catalogueController");
const catalogueValidationSchema = require("../apiValidationSchemas/catalogueValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(catalogueValidationSchema.create),
  catalogueController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(catalogueValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  catalogueController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateQuery(catalogueValidationSchema.findAll),
  // jwtValidation.validateAdminToken,
  catalogueController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(catalogueValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(catalogueValidationSchema.update),
  catalogueController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(catalogueValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(catalogueValidationSchema.findById),
  catalogueController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(catalogueValidationSchema.deleteMultiple),
  catalogueController.deleteMultiple
);

module.exports = router;
