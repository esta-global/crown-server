const catalogueCategoryModel = require("../database/models/catalogueCategoryModel");
const {
  serviceResponse,
  catalogueCategoryMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await catalogueCategoryModel.findOne({
      name: serviceData.name,
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: catalogueCategoryMessage.ALREADY_EXISTS,
      };
      response.message = catalogueCategoryMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new catalogueCategoryModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = catalogueCategoryMessage.CREATED;
    } else {
      response.message = catalogueCategoryMessage.NOT_CREATED;
      response.errors.error = catalogueCategoryMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(
      `Service : catalogueCategoryService: create, Error : ${error}`
    );
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await catalogueCategoryModel.findById({
      _id: serviceData.id,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = catalogueCategoryMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = catalogueCategoryMessage.NOT_AVAILABLE;
      response.message = catalogueCategoryMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(
      `Service : catalogueCategoryService: findById, Error : ${error}`
    );
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    let sortCondition = { createdAt: -1 };
    const {
      limit = 10,
      page = 1,
      searchQuery,
      status = true,
      isDeleted = false,
      priority = "",
      slug = "",
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { slug: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    if (slug) conditions.slug = slug;

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    if (priority) {
      sortCondition = {
        priority: priority == "ASC" ? 1 : -1,
      };
    }

    // count record
    const totalRecords = await catalogueCategoryModel.countDocuments(
      conditions
    );
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await catalogueCategoryModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortCondition)
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = catalogueCategoryMessage.FETCHED;
    } else {
      response.message = catalogueCategoryMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(
      `Service : catalogueCategoryService: findAll, Error : ${error}`
    );

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await catalogueCategoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = catalogueCategoryMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = catalogueCategoryMessage.NOT_UPDATED;
      response.errors.id = catalogueCategoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : catalogueCategoryService: update, Error : ${error}`
    );
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await catalogueCategoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await catalogueCategoryModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = catalogueCategoryMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = catalogueCategoryMessage.NOT_DELETED;
      response.errors.id = catalogueCategoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : catalogueCategoryService: delete, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await catalogueCategoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await catalogueCategoryModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${catalogueCategoryMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = catalogueCategoryMessage.NOT_DELETED;
      response.errors.id = catalogueCategoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : catalogueCategoryService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
