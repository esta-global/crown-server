const router = require("express").Router();
const popupController = require("../controllers/popupController");
const popupValidationSchema = require("../apiValidationSchemas/popupValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(popupValidationSchema.create),
  popupController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(popupValidationSchema.findById),
  popupController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateQuery(popupValidationSchema.findAll),
  popupController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(popupValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(popupValidationSchema.update),
  popupController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(popupValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(popupValidationSchema.findById),
  popupController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(popupValidationSchema.deleteMultiple),
  popupController.deleteMultiple
);

module.exports = router;
