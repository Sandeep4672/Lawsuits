import { LawyerRequest } from "../models/lawyerRequest.model.js";
import { Lawyer } from "../models/lawyer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ConnectionRequest } from "../models/connectionRequest.model.js";


export const getAllLawyersRequest = asyncHandler(async (req, res) => {
  try {
    const lawyerRequests = await LawyerRequest.find().select("-password");
    console.log("Lawyers Requests:", lawyerRequests);

    res.status(200).json({
      success: true,
      data: lawyerRequests,
    });
  } catch (error) {
    console.error("Error fetching lawyer requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lawyer requests",
    });
  }
});


export const getLawyerRequestById = async (req, res, next) => {
  try {
    const requestId = req.params.id;

    const request = await LawyerRequest.findById(requestId).select("-password"); // exclude password

    if (!request) {
      return res.status(404).json({ message: "Lawyer request not found" });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};



export const getAllLawyersList = asyncHandler(async (req, res) => {
  try {
    const lawyers = await Lawyer.find().select("-password -refreshToken");
    console.log("Verified Lawyers:", lawyers);

    res.status(200).json({
      success: true,
      data: lawyers,
    });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lawyers",
    });
  }
});



export const acceptLawyerRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;

  const lawyerRequest = await LawyerRequest.findById(requestId).select("-refreshToken"); 
  if (!lawyerRequest) {
    throw new ApiError(404, "Lawyer request not found");
  }

  const lawyer = new Lawyer({
    fullName: lawyerRequest.fullName,
    email: lawyerRequest.email,
    password: lawyerRequest.password, 
    phone: lawyerRequest.phone,
    barId: lawyerRequest.barId,
    practiceAreas: lawyerRequest.practiceAreas,
    experience: lawyerRequest.experience,
    sop: lawyerRequest.sop,
    proofFile: lawyerRequest.proofFile,
  });

  await lawyer.save();

  await lawyerRequest.deleteOne();

  res.status(200).json({
    success: true,
    message: "Lawyer request accepted and verified lawyer created",
    data: lawyer,
  });
});


export const declineLawyerRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;

  const request = await LawyerRequest.findById(requestId);
  if (!request) {
    throw new ApiError(404, "Lawyer request not found");
  }

  await LawyerRequest.findByIdAndDelete(requestId);

  res.status(200).json({
    success: true,
    message: "Lawyer request rejected and removed",
  });
});

export const getLawyerById = asyncHandler(async (req, res) => {
  const lawyerId = req.user._id;

  try {
    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lawyer,
    });
  } catch (error) {
    console.error("Error fetching lawyer profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch lawyer profile",
      error: error.message,
    });
  }
});


export const getAllConnectionRequests = asyncHandler(async (req, res) => {
  const lawyerId = req.user._id;

  const requests = await ConnectionRequest.find({ lawyer: lawyerId, status: "pending" })
    .populate("client", "fullName email")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, requests, "Pending connection requests fetched successfully")
  );
});


export const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const lawyerId = req.user._id;

  const request = await ConnectionRequest.findOne({ _id: requestId, lawyer: lawyerId });

  if (!request) {
    throw new ApiError(404, "Connection request not found");
  }

  if (request.status === "accepted") {
    throw new ApiError(400, "Request already accepted");
  }

  request.status = "accepted";
  await request.save();

  // const existingThread = await ChatThread.findOne({
  //   client: request.client,
  //   lawyer: request.lawyer,
  //   caseRequest: request._id,
  // });

  // if (!existingThread) {
  //   await ChatThread.create({
  //     client: request.client,
  //     lawyer: request.lawyer,
  //     caseRequest: request._id,
  //   });
  // }

  res.status(200).json(new ApiResponse(200, request, "Connection request accepted"));
});

export const rejectConnectionRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const lawyerId = req.user._id;

  const request = await ConnectionRequest.findOneAndDelete({
    _id: requestId,
    lawyer: lawyerId,
    status: { $ne: "accepted" },
  });

  if (!request) {
    throw new ApiError(404, "Request not found or already accepted");
  }

  res.status(200).json(new ApiResponse(200, null, "Connection request rejected and deleted"));
});


export const getAllConnections = asyncHandler(async (req, res) => {
  const lawyerId = req.user._id;

  const acceptedConnections = await ConnectionRequest.find({
    lawyer: lawyerId,
    status: "accepted",
  })
    .populate("client", "fullName email")
    .sort({ updatedAt: -1 });

  res.status(200).json(
    new ApiResponse(200, acceptedConnections, "Accepted connections fetched successfully")
  );
});