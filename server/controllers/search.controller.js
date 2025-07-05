import { PdfDocument } from "../models/pdf.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import path from "path";
import fs from "fs";
export const searchCases = asyncHandler(async (req, res) => {
  const {
    query = "",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    court,          
    caseType,    
    fromDate,     
    toDate,         
    tags            
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  let searchQuery = {};

  if (query.trim()) {
    searchQuery.$text = { $search: query };
  }

  if (court) {
    searchQuery.court = court;
  }

  if (caseType) {
    searchQuery.caseType = caseType;
  }

  if (fromDate || toDate) {
    searchQuery.dateOfJudgment = {};
    if (fromDate) searchQuery.dateOfJudgment.$gte = new Date(fromDate);
    if (toDate) searchQuery.dateOfJudgment.$lte = new Date(toDate);
  }

  if (tags) {
    const tagArray = tags.split(",").map((tag) => tag.trim());
    searchQuery.tags = { $in: tagArray };
  }

  let results = await PdfDocument.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  let totalResults = await PdfDocument.countDocuments(searchQuery);

  if (results.length === 0 && query.trim()) {
    const regex = new RegExp(query, "i");
    const fallbackQuery = {
      $or: [
        { title: regex },
        { description: regex },
        { tags: regex },
        { contentText: regex }
      ],
      ...searchQuery 
    };

    results = await PdfDocument.find(fallbackQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    totalResults = await PdfDocument.countDocuments(fallbackQuery);
  }

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


const updateUserRecentCases = async (userId, caseId) => {
  console.log("Reached Here");
  const user = await User.findById(userId);

  user.recentCases = user.recentCases.filter(
    (entry) => entry.caseId.toString() !== caseId.toString()
  );

  user.recentCases.unshift({ caseId });

  if (user.recentCases.length > 10) {
    user.recentCases = user.recentCases.slice(0, 10);
  }

  await user.save();
};


export const getCaseById=asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Case ID is required"));
  }

  const caseData = await PdfDocument.findById({_id:id});
  if(req.user){
    updateUserRecentCases(req.user._id,id);
  }
  //console.log("Case data retrieved:", caseData);
  if (!caseData) {
    return res.status(404).json(new ApiResponse(404, null, "Case not found"));
  }
  const caseObj =caseData.toObject();
  caseObj.pdfUrl =caseData.cloudinary?.secure_url || null;
  res.status(200).json(new ApiResponse(200, caseObj, "Case retrieved successfully"));
});



const loadFaqs = () => {
  const filePath = path.resolve("./utils/faqs.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

export const getAnswerChatBotFaq=asyncHandler(async(req,res)=>{
   const userQuestion = req.body.question?.toLowerCase().trim();
  if (!userQuestion) {
    return res.status(400).json({ reply: "Please enter a valid question." });
  }

  const faqs = loadFaqs();

  for (let faq of faqs) {
    if (faq.keywords.some((kw) => userQuestion.includes(kw.toLowerCase()))) {
      return res.json({ reply: faq.answer });
    }
  }

  res.json({
    reply:
      "Sorry, I couldn't find an answer to that. Please contact support@lawsuits.com for help."
  });
})
