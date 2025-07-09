class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
   filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // تحويل الشكل من 'price[lte]': '50' إلى { price: { $lte: 50 } }
    let mongoQuery = {};
    Object.keys(queryObj).forEach(key => {
        if (key.includes('[')) {
            const field = key.split('[')[0]; // price
            const operator = key.match(/\[(.*)\]/)[1]; // lte
            if (!mongoQuery[field]) mongoQuery[field] = {};
            mongoQuery[field][`$${operator}`] = +queryObj[key]; // convert to number
        } else {
            mongoQuery[key] = queryObj[key];
        }
    });

    this.mongooseQuery = this.mongooseQuery.find(mongoQuery);
    return this;
}

    search() {
        if (this.queryString.search) {
            const searchTerm = this.queryString.search;
            console.log(`Search term: ${searchTerm}`); // Debugging line to see the search term
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { title : { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { slug: { $regex: searchTerm, $options: 'i' } },
                    { category: { $regex: searchTerm, $options: 'i' } },
                    { subCategory: { $regex: searchTerm, $options: 'i' } },
                    { brand: { $regex: searchTerm, $options: 'i' } }
                ]
            });
        }
        return this;
    }
    fieldsLimiting() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery.select(fields);
        }
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery.sort('-createdAt'); // Default sorting
        }
        return this;
    }
    pagination(countDocuments) {
        const page = Number(this.queryString.page) || 1; // Default to page 1
        const limit = Number(this.queryString.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit; // Calculate the number of items to skip
        const endIndex = page * limit;

        const paginationInfo = {};
        paginationInfo.page = page;
        paginationInfo.limit = limit;
        paginationInfo.totalPages = Math.ceil(countDocuments / limit);

        // next page 
        if (endIndex < countDocuments) {
            paginationInfo.next = {
                page: page + 1,
                limit: limit
            };
        }
        // previous page
        if (skip > 0) {
            paginationInfo.previous = {
                page: page - 1,
                limit: limit
            };
        }

        this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = paginationInfo; // Attach pagination info to the query
        return this;
    }
    mongooseQuery() {
        return this.mongooseQuery;
    }
}
module.exports = ApiFeatures;