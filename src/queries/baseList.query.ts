import { BaseQueryParamsDTO } from "@dtos";
import { FilterQuery, PipelineStage } from "mongoose";

export async function baseListQuery(
  baseQuery: PipelineStage[],
  queryParams: BaseQueryParamsDTO,
  searchFields: any,
  filterFields: any,
  option?: {}
) {
  const defaultOpt = {
    auditData: false,
    showDeleted: false,
    ignorePagination: false,
    ignoreSearch: false,
    ignoreFilter: false,
    formateDate: true,
    ignoreSort: false,
    sortObject: {},
    ...option,
  };

  const query = [
    ...(!defaultOpt.showDeleted
      ? [
          {
            $match: {
              isDeleted: false,
            },
          },
        ]
      : []),
    ...baseQuery,
  ];

  // Count Query
  const countQuery = [...query];

  //Sort and Pagination
  const pageNum: number = queryParams.pageNum
    ? parseInt(queryParams.pageNum)
    : 1;
  const limit: number = queryParams.pageLimit
    ? parseInt(queryParams.pageLimit)
    : 10;

  const sortField: string = !queryParams?.sortField
    ? "_id"
    : queryParams.sortField;

  const sortOrder = queryParams?.sortOrder === "asc" ? 1 : -1;

  const sort: Record<string, 1 | -1> = {
    [sortField]: sortOrder,
  };

  const length = query.length - 1 > -1 ? query.length - 1 : 0;
  query.splice(length, 0, {
    $sort: !defaultOpt.ignoreSort ? sort : defaultOpt.sortObject,
  });

  //   auditdata

  // filter query
  let filters: FilterQuery<any> = {};
  if (
    Object.keys(filterFields && queryParams).length &&
    !defaultOpt?.ignoreFilter
  ) {
    filters = await getFiltersQuery(filterFields, queryParams);
  }

  if (searchFields.length && queryParams.search && !defaultOpt.ignoreSearch) {
    const searchQuery = getSearchQuery(searchFields, queryParams.search);
    if (searchQuery.length) filters.$or = searchQuery;
  }

  if (Object.keys(filters).length) {
    const match: PipelineStage.Match = {
      $match: filters,
    };
    const length = query.length - 1 > -1 ? query.length - 1 : 0;
    query.splice(length, 0, match);
    countQuery.splice(length, 0, match);
  }

  countQuery.push({
    $group: {
      _id: null,
      totakCount: { $sum: 1 },
    },
  });

  const paginationQuery: PipelineStage.FacetPipelineStage[] = [];
  if (
    !defaultOpt.ignorePagination &&
    queryParams?.pageLimit?.toLowerCase() !== "all"
  ) {
    const skip = limit * (pageNum - 1);
    paginationQuery.push({ $skip: skip }, { $limit: limit });
    const length = query.length - 1 > -1 ? query.length - 1 : 0;
    query.splice(length, 0, ...paginationQuery);
  }
  return {
    query,
    pageNum,
    limit,
    countQuery,
  };
}
const getFiltersQuery = async (filterFields: any, queryParams: any) => {
  if (typeof filterFields !== "object") return {};
  const filters: FilterQuery<any> = { $and: [] };
  const filterKey = Object.keys(filterFields);
  for (const filter of filterKey) {
    const trimmedFeild = filter.trim();
    const value = queryParams[trimmedFeild]?.trim();
    if (!value) continue;
    const type = filterFields[trimmedFeild].type;
    if (type === "string") {
      const values = value.split(",").map((val) => val.trim());
      const condition =
        values.length > 1
          ? {
              $or: values.map((val) => ({
                [trimmedFeild]: { $regex: val, $options: "i" },
              })),
            }
          : {
              [trimmedFeild]: { $regex: values[0], $options: "i" },
            };
      filters.$and.push(condition);
    } else if (type === "date") {
      try {
        const DATE = new Date(value);
        const date = DATE.getDate();
        const month = DATE.getMonth();
        const year = DATE.getFullYear();
        const startDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, date, 23, 59, 59, 999));
        if (!(startDate instanceof Date && isFinite(+startDate))) continue;
        const condition = {
          [trimmedFeild]: {
            $lte: startDate,
            $gte: endDate,
          },
        };
        filters.$and.push(condition);
      } catch (err) {
        continue;
      }
    }
  }
  return filters.$and.length ? filters : {};
};

const getSearchQuery = (searchFields: string[], searchString: string) => {
  const searchObject: Array<FilterQuery<any>> = [];
  const specialCharacters = /[.*+?^${}()|[\]\\]/g;
  const sanitizedSearch = searchString.replace(specialCharacters, "\\$&");
  for (const field of searchFields) {
    searchObject.push({
      [field.trim()]: {
        $regex: sanitizedSearch,
        $options: "i",
      },
    });
  }
  return searchObject;
};
