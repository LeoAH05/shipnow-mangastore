const ErrorDictionary = require("../errors/errorDictionary");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const toPositiveInt = (value, fallback) => {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw ErrorDictionary.PAGINATION_INVALID();
  return number;
};


const parsePagination = (query = {}) => ({
  page: toPositiveInt(query.page, DEFAULT_PAGE),
  limit: Math.min(toPositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT),
});

const buildPagination = ({ page, limit }, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

module.exports = { parsePagination, buildPagination };