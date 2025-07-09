const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) => {
    return asyncHandler(async (req, res, next) => {
        if (req.body.name) {
            req.body.slug = slugify(req.body.name);
        }
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const doc = await Model.create(req.body);
        res.status(201).json({ data: doc });
    });
}

exports.getAll = (Model) => {
    return asyncHandler(async (req, res) => {
        const countDoc = await Model.countDocuments();
        const apiFeatures = new ApiFeatures(Model.find(), req.query)
            .pagination(countDoc)
            .filter()
            .search()
            .fieldsLimiting()
            .sort();

        const { mongooseQuery, paginationResult } = apiFeatures;
        const docs = await mongooseQuery;

        res.status(200).json({
            results: docs.length,
            paginationResult,
            data: docs
        });
    })};

exports.getOne = (Model, populateOptions) => {
    return asyncHandler(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) {
            query = query.populate(populateOptions);
        }
        const doc = await query;
        if (!doc) {
            return next(new ApiError(`No document found with ID ${req.params.id}`, 404));
        }
        res.status(200).json({ data: doc });
    });
}
exports.updateOne = (Model) => {
    return asyncHandler(async (req, res, next) => {
        if (req.body.name) {
            req.body.slug = slugify(req.body.name);
        }
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc) {
            return next(new ApiError(`No document found with ID ${req.params.id}`, 404));
        }
        res.status(200).json({ data: doc });
    });
}
exports.deleteOne = (Model) =>{
    return asyncHandler(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new ApiError(`No document found with ID ${req.params.id}`, 404));
        }
        res.status(204).json({ data: null });
    });
}