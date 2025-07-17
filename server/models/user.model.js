import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
         rsaPublicKey:           { type: String, required: true },
        encryptedPrivateKey: { type: String, required: true },
salt: { type: String, required: true },
iv: { type: String, required: true },


        recentCases: [
            {
                caseId: { type: mongoose.Schema.Types.ObjectId, ref: "PdfDocument" },
                visitedAt: { type: Date, default: Date.now }
            }
        ]
        ,
        savedCases: [
            {
                caseId: { type: mongoose.Schema.Types.ObjectId, ref: "PdfDocument" },
                savedAt: { type: Date, default: Date.now }
            }
        ]
        ,
        refreshToken: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        }


    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: "user"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
