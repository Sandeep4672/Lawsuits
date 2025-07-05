import { Lawyer } from "../models/lawyer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ConnectionRequest } from "../models/connectionRequest.model.js";
import { ChatThread } from "../models/chatThread.model.js";





export const getAllLawyersList = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const lawyers = await Lawyer.find()
      .select("-password -refreshToken")
      .lean();                      

    const connectedLawyerIds = await ChatThread
      .find({ client: userId })
      .distinct("lawyer");         

    const data = lawyers.map(lawyer => ({
      ...lawyer,
      isConnected: connectedLawyerIds.some(id => id.equals(lawyer._id))
    }));

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lawyers",
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

  const existingThread = await ChatThread.findOne({
    client: request.client,
    lawyer: request.lawyer,
    caseRequest: request._id,
  });

  let chatThread = existingThread;

  if (!chatThread) {
    chatThread = await ChatThread.create({
      client: request.client,
      lawyer: request.lawyer,
      caseRequest: request._id,
    });
  }

  res.status(200).json(
    new ApiResponse(200, { request, chatThread }, "Connection request accepted and chat enabled")
  );
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

