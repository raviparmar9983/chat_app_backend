import { FilterQuery, PipelineStage } from 'mongoose';

export const baseListQuery = (
  baseQuery: PipelineStage[],
  queryParams: any,
  searchFields: string[],
  filterFields: any,
  option = {},
) => {
  const defaultOpt = {
    auditData: false,
    showDeleted: false,
    ignorePagination: false,
    ignoreSearch: false,
    ignoreSort: false,
    formatdate: true,
    ignoreFilter: false,
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

  const countQuery = [...query];

  const pageNum = !queryParams.pageNum ? 1 : parseInt(queryParams.pageNum);
  const pageLimit = !queryParams.pageLimit
    ? 10
    : parseInt(queryParams.pageLimit);

  const sortFeild = !queryParams.sortFeild ? '_id' : queryParams.sortFeild;
  const sortOrder = queryParams?.sortOrder === 'asc' ? 1 : -1;

  const sort = {
    [sortFeild]: sortOrder,
  };

  if (!defaultOpt.sortObject || Object.keys(defaultOpt.sortObject).length) {
    const length =
      query.length - 1 > -1
        ? query.length - 1 === 0
          ? 1
          : query.length - 1
        : 0;
    query.splice(length, 0, {
      $sort: !defaultOpt.ignoreSort ? sort : defaultOpt.sortObject,
    });
  }

  // audit data

  //filters
  let filters: FilterQuery<any> = {};
  if (
    Object.keys(filterFields && queryParams).length &&
    !defaultOpt.ignoreFilter
  ) {
    filters = getFilterQuery(filterFields, queryParams);
  }

  // search
  if (queryParams.search && !defaultOpt.ignoreSearch && searchFields.length) {
    const searchQuery = getSerchQuery(queryParams, searchFields);
    if (searchQuery?.length) filters.$or = searchQuery;
  }

  if (Object.keys(filters).length) {
    const match: PipelineStage.Match = {
      $match: filters,
    };
    const length =
      query.length - 1 > -1
        ? query.length - 1 === 0
          ? 1
          : query.length - 1
        : 0;
    query.splice(length, 0, match);
    countQuery.splice(length, 0, match);
  }

  const facetQuery: { $facet: any } = { $facet: {} };
  facetQuery.$facet.totalCount = [
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
      },
    },
  ];
  // countQuery.push({
  //   $group: {
  //     _id: null,
  //     totalCount: { $sum: 1 },
  //   },
  // });

  // const paginationQuery: PipelineStage.FacetPipelineStage[] = [];
  if (
    !defaultOpt.ignorePagination &&
    queryParams?.pageLimit?.toLowerCase() !== 'all'
  ) {
    const skip = pageLimit * (pageNum - 1);
    // paginationQuery.push({ $skip: skip }, { $limit: pageLimit });
    facetQuery.$facet.data = [{ $skip: skip }, { $limit: pageLimit }];
  }
  const length =
    query.length - 1 > -1 ? (query.length - 1 === 0 ? 1 : query.length - 1) : 0;
  query.splice(length + 1, 0, facetQuery);
  return { query, pageNum, pageLimit, countQuery };
};

const getFilterQuery = (filterFeilds: any, queryParams: any) => {
  if (typeof filterFeilds !== 'object') return {};
  const filters: FilterQuery<any> = { $and: [] };
  const filterKeys = Object.keys(filterFeilds);
  for (const feild of filterKeys) {
    const trimmedField = feild.trim();
    const value = queryParams[trimmedField]?.trim();
    if (!value) continue;
    const type = filterFeilds[trimmedField].type;
    if (type === 'string') {
      const values = value.split(',').map((val: string) => val.trim());
      const condition =
        value.length > 1
          ? {
              $or: values.map((val) => ({
                [trimmedField]: { $regex: val, $options: 'i' },
              })),
            }
          : {
              [trimmedField]: { $regex: value[0], $options: 'i' },
            };
      filters.$and.push(condition);
    } else if (type === 'number') {
      filters.$and.push({ [trimmedField]: value });
    }
  }
  return filters.$and.length ? filters : {};
};

const getSerchQuery = (queryParams: any, searchFields: string[]) => {
  const searchObject: Array<FilterQuery<any>> = [];
  for (const feild of searchFields) {
    const specialCharacters = /[.*+?^${}()|[\]\\]/g;
    const sanitizeSeach = queryParams.search.replace(specialCharacters, '\\$&');
    searchObject.push({
      [feild.trim()]: {
        $regex: sanitizeSeach,
        $options: 'i',
      },
    });
  }
  return searchObject;
};
