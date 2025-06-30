import { PdfDocument } from "../models/pdf.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const searchCases = asyncHandler(async (req, res) => {
  console.log("Search request received with query:", req.query);

  const {
    query = "",         
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc"
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  let searchQuery = {};

  if (query.trim()) {
    searchQuery = { $text: { $search: query } };
  }

  // Perform search
  let results = await PdfDocument.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  let totalResults = await PdfDocument.countDocuments(searchQuery);

  if (results.length === 0 && query.trim()) {
    const regex = new RegExp(query, "i");
    searchQuery = {
      $or: [
        { title: regex },
        { description: regex },
        { tags: regex },
        { contentText: regex }
      ]
    };

    results = await PdfDocument.find(searchQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    totalResults = await PdfDocument.countDocuments(searchQuery);
  }
  console.log(totalResults);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        totalResults,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalResults / parseInt(limit)),
      },
      "Search completed"
    )
  );
});

export const getCaseById=asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Case ID is required"));
  }

  const caseData = await PdfDocument.findById({_id:id});
  console.log("Case data retrieved:", caseData);
  if (!caseData) {
    return res.status(404).json(new ApiResponse(404, null, "Case not found"));
  }
  const caseObj =caseData.toObject();
  caseObj.pdfUrl =caseData.cloudinary?.secure_url || null;
  res.status(200).json(new ApiResponse(200, caseObj, "Case retrieved successfully"));
});
