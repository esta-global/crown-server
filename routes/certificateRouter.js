const router = require("express").Router();
const certificateController = require("../controllers/certificateController");
const certificateValidationSchema = require("../apiValidationSchemas/certificateValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(certificateValidationSchema.create),
  certificateController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(certificateValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  certificateController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateQuery(certificateValidationSchema.findAll),
  // jwtValidation.validateAdminToken,
  certificateController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(certificateValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(certificateValidationSchema.update),
  certificateController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(certificateValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(certificateValidationSchema.findById),
  certificateController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(certificateValidationSchema.deleteMultiple),
  certificateController.deleteMultiple
);

module.exports = router;
