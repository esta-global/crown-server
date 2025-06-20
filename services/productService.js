const productModel = require("../database/models/productModel");
const sizeFinishModel = require("../database/models/sizeFinishModel");
const { serviceResponse, productMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");
const { google } = require("googleapis");
const categoryModel = require("../database/models/categoryModel");
const subCategoryModel = require("../database/models/subCategoryModel");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check if the product slug already exists
    const isSlugExist = await productModel.findOne({ slug: serviceData.slug });

    if (isSlugExist) {
      response.errors = {
        slug: productMessage.SLUG_ALREADY_EXISTS,
      };
      response.message = productMessage.SLUG_ALREADY_EXISTS;
      return response;
    }

    // Check if the product decor Number already exists
    const isDecorNumberExist = await productModel.findOne({
      decorNumber: serviceData.decorNumber,
    });

    if (isDecorNumberExist) {
      response.errors = {
        decorNumber: productMessage.DECOR_NUMBER_ALREADY_EXISTS,
      };
      response.message = productMessage.DECOR_NUMBER_ALREADY_EXISTS;
      return response;
    }

    if (serviceData.image) {
      const authenticate = () => {
        const auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_KEY_FILE || "./crown-google-api.json", // Use environment variable or default path
          scopes: ["https://www.googleapis.com/auth/drive"],
        });
        return auth;
      };

      const auth = authenticate();
      const drive = google.drive({ version: "v3", auth });

      try {
        const res = await drive.files.list({
          q: `'${serviceData.image}' in parents`, // Query files in the specified folder
          fields: "files(id, name)",
        });

        if (!res?.data?.files?.length) {
          throw new Error("No files found in the specified folder");
        }

        const images = {};
        for (let file of res.data.files) {
          const fileName = file?.name?.split(".")[0];
          if (fileName) images[fileName] = file.id;
        }

        const createThumbnailUrl = (fileId, size = 5000) =>
          `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;

        if (images["a4Image"]) {
          serviceData["a4Image"] = createThumbnailUrl(images["a4Image"]);
        }

        if (images["fullSheetImage"]) {
          serviceData["fullSheetImage"] = createThumbnailUrl(
            images["fullSheetImage"]
          );
        }

        if (images["highResolutionImage"]) {
          serviceData["highResolutionImage"] = createThumbnailUrl(
            images["highResolutionImage"]
          );
        }
      } catch (error) {
        logFile.write(
          `Error fetching files from Google Drive: ${error.message}`
        );

        throw new Error(
          "Failed to fetch images from Google Drive",
          error.message
        );
      }
    }

    if (serviceData.sizes) {
      const sizeFinishes = await sizeFinishModel.find(
        {
          size: { $in: serviceData.sizes },
        },
        { _id: 1 }
      );

      serviceData.sizeFinishes = sizeFinishes;
    }

    // const newData = new productModel(serviceData);
    // const result = (await newData.save()).populate();

    const newData = new productModel(serviceData);
    const savedResult = await newData.save();
    const result = await savedResult.populate([
      "categories",
      "subCategories",
      "decorSeries",
      "sizes",
    ]);

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = productMessage.CREATED;
    } else {
      response.message = productMessage.NOT_CREATED;
      response.errors.error = productMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service: productService: create, Error: ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await productModel
      .findById({ _id: serviceData.id })
      .populate({ path: "categories", select: "name" })
      .populate({ path: "subCategories", select: "name" })
      .populate({ path: "decorSeries", select: "title" })
      .populate({ path: "sizes", select: "title" })
      .populate({ path: "sizeFinishes" });
    if (result) {
      // Perform further population on the result
      const populatedResult = await productModel.populate(result, [
        {
          path: "sizeFinishes.size", // Populate a subfield within sizeFinishes
          select: "title", // Select specific fields
        },
        {
          path: "sizeFinishes.finishes", // Populate a subfield within sizeFinishes
          select: "shortName fullName", // Select specific fields
        },
      ]);

      response.body = dbHelper.formatMongoData(populatedResult);
      response.message = productMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = productMessage.NOT_AVAILABLE;
      response.message = productMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : productService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// findBySlug
module.exports.findBySlug = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await productModel
      .findOne({ slug: serviceData.slug })
      .populate({ path: "categories", select: "name" })
      .populate({ path: "subCategories", select: "name" })
      .populate({ path: "decorSeries", select: "title" })
      .populate({ path: "sizes", select: "title" })
      .populate({ path: "sizeFinishes" });
    if (result) {
      // Perform further population on the result
      const populatedResult = await productModel.populate(result, [
        {
          path: "sizeFinishes.size", // Populate a subfield within sizeFinishes
          select: "title", // Select specific fields
        },
        {
          path: "sizeFinishes.finishes", // Populate a subfield within sizeFinishes
          select: "shortName fullName", // Select specific fields
        },
      ]);

      response.body = dbHelper.formatMongoData(populatedResult);
      response.message = productMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = productMessage.NOT_AVAILABLE;
      response.message = productMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : productService: findBySlug, Error : ${error}`);
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    let sortCondition = { updatedAt: -1 };

    const {
      limit = 10,
      page = 1,
      searchQuery,
      status = true,
      isDeleted = false,
      category,
      subCategory,
      categories = [],
      subCategories = [],
      decorSeries,
      decorNumber,
      sizes = [],
      categorySlug = "",
      subCategorySlug = "",
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { slug: { $regex: searchQuery, $options: "i" } },
          { decorNumber: { $regex: searchQuery, $options: "i" } },
        ],
      };

      if (!isNaN(Number(searchQuery))) {
        // conditions.decorNumber = searchQuery;
        sortCondition = { decorNumber: 1 };
      }
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    if (category) conditions.categories = category;
    if (subCategory) conditions.subCategories = subCategory;

    // for category slug
    if (categorySlug) {
      const catData = await categoryModel.findOne({ slug: categorySlug });
      if (!catData) return;
      conditions.categories = catData._id;
    }

    // for sub category slug
    if (subCategorySlug) {
      const catData = await subCategoryModel.findOne({ slug: subCategorySlug });
      if (!catData) return;
      conditions.subCategories = catData._id;
    }

    if (categories?.length) {
      conditions.categories = {
        $in: categories,
      };
    }

    if (subCategories.length) {
      conditions.subCategories = {
        $in: subCategories,
      };
    }

    // if (decorSeries) conditions.decorSeries = decorSeries;

    if (decorNumber) conditions.decorNumber = decorNumber;

    if (sizes) {
      if (Array.isArray(sizes) && sizes.length) {
        conditions.sizes = { $in: sizes };
      } else if (typeof sizes === "string") {
        conditions.sizes = sizes; // Single ID case
      }
    }

    if (decorSeries) {
      if (Array.isArray(decorSeries) && decorSeries.length) {
        conditions.decorSeries = { $in: decorSeries };
      } else if (typeof decorSeries === "string") {
        conditions.decorSeries = decorSeries; // Single ID case
      }
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await productModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await productModel
      .find(conditions)
      .populate({ path: "categories", select: "name" })
      .populate({ path: "subCategories", select: "name" })
      .populate({ path: "decorSeries", select: "title" })
      .populate({ path: "sizes", select: "title" })
      .populate({ path: "sizeFinishes" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort()
      .limit(parseInt(limit));

    if (result) {
      // Perform further population on the result
      const populatedResult = await productModel.populate(result, [
        {
          path: "sizeFinishes.size", // Populate a subfield within sizeFinishes
          select: "title", // Select specific fields
        },
        {
          path: "sizeFinishes.finishes", // Populate a subfield within sizeFinishes
          select: "shortName fullName", // Select specific fields
        },
      ]);

      response.body = dbHelper.formatMongoData(populatedResult);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = productMessage.FETCHED;
    } else {
      response.message = productMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : productService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    if (body.sizes) {
      let sizeFinishes = await sizeFinishModel.find(
        {
          size: { $in: body.sizes },
        },
        { _id: 1 }
      );

      body.sizeFinishes = sizeFinishes;
    }

    const result = await productModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = productMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_UPDATED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await productModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await productModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = productMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_DELETED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await productModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await productModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${productMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_DELETED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
