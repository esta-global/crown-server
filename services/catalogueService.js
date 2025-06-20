const catalogueModel = require("../database/models/catalogueModel");
const { serviceResponse, catalogueMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await catalogueModel.findOne({
      name: serviceData.name,
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: catalogueMessage.ALREADY_EXISTS,
      };
      response.message = catalogueMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new catalogueModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = catalogueMessage.CREATED;
    } else {
      response.message = catalogueMessage.NOT_CREATED;
      response.errors.error = catalogueMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : catalogueService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await catalogueModel
      .findById({ _id: serviceData.id })
      .populate({ path: "category" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = catalogueMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = catalogueMessage.NOT_AVAILABLE;
      response.message = catalogueMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : catalogueService: findById, Error : ${error}`);
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
      category,
      status = true,
      isDeleted = false,
      priority = "",
      slug = "",
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ name: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    if (category) conditions.category = category;

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    if (slug) conditions.slug = slug;

    if (priority) {
      sortCondition = {
        priority: priority == "ASC" ? 1 : -1,
      };
    }

    // count record
    const totalRecords = await catalogueModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await catalogueModel
      .find(conditions)
      .populate({ path: "category" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortCondition)
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = catalogueMessage.FETCHED;
    } else {
      response.message = catalogueMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : catalogueService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await catalogueModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = catalogueMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = catalogueMessage.NOT_UPDATED;
      response.errors.id = catalogueMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : catalogueService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await catalogueModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await catalogueModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = catalogueMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = catalogueMessage.NOT_DELETED;
      response.errors.id = catalogueMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : catalogueService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await catalogueModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await catalogueModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${catalogueMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = catalogueMessage.NOT_DELETED;
      response.errors.id = catalogueMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : catalogueService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
