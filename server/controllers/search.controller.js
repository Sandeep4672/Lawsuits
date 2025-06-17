import { PdfDocument } from "../models/pdf.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const searchCases = asyncHandler(async (req, res) => {
    console.log("Search request received with query:", req.query);
  const {
    query = "",               // Free text input
    court,                    // Filter: Court name
    caseType,                 // Filter: Case type (e.g., "Murder")
    tags,                     // Filter: Comma-separated tags
    startDate, endDate,       // Filter: Date range
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc"
  } = req.query;

  const searchQuery = {};

  // 1. Text search if query exists
  if (query.trim()) {
    searchQuery.$text = { $search: query };
  }

  // 2. Court filter
  if (court) {
    searchQuery.court = new RegExp(court, "i"); // case-insensitive regex
  }

  // 3. Case Type filter
  if (caseType) {
    searchQuery.caseType = new RegExp(caseType, "i");
  }

  // 4. Tags filter
  if (tags) {
    const tagArray = tags.split(",").map(tag => tag.trim().toLowerCase());
    searchQuery.tags = { $in: tagArray };
  }

  // 5. Date range
  if (startDate || endDate) {
    searchQuery.dateOfJudgment = {};
    if (startDate) searchQuery.dateOfJudgment.$gte = new Date(startDate);
    if (endDate) searchQuery.dateOfJudgment.$lte = new Date(endDate);
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  // 6. Execute query
  const results = await PdfDocument.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  const totalResults = await PdfDocument.countDocuments(searchQuery);

  res.status(200).json(
    new ApiResponse(200, {
      results,
      totalResults,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalResults / parseInt(limit)),
    }, "Search completed")
  );
});
