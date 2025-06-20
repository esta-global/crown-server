const popupModel = require("../database/models/popupModel");
const { serviceResponse, popupMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const newData = new popupModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = popupMessage.CREATED;
    } else {
      response.message = popupMessage.NOT_CREATED;
      response.errors.error = popupMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : popupService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await popupModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = popupMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = popupMessage.NOT_AVAILABLE;
      response.message = popupMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : popupService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    const {
      limit = 10,
      page = 1,
      searchQuery,
      status = "ALL",
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ email: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // status
    if (status == "ALL") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await popupModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await popupModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = popupMessage.FETCHED;
    } else {
      response.message = popupMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : popupService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await popupModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = popupMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = popupMessage.NOT_UPDATED;
      response.errors.id = popupMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : popupService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await popupModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await popupModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = popupMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = popupMessage.NOT_DELETED;
      response.errors.id = popupMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : popupService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await popupModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await popupModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${popupMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = popupMessage.NOT_DELETED;
      response.errors.id = popupMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : popupService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
