"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageController = exports.GetConservationController = exports.GetConservationsController = exports.CreateConversationController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const Conversation_1 = require("../models/Conversation");
const CreateConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { userId } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const user2 = await User_1.default.findOne({ _id: userId });
        if (!user2) {
            res.status(400).json({ message: "User not found!" });
            return;
        }
        if (user2.private &&
            user._id.toString() !== user2._id.toString() &&
            !user2.allowed.includes(user._id)) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversationExist = await Conversation_1.ConversationModel.findOne({
            members: { $all: [user._id, user2._id] },
        });
        if (conversationExist) {
            res.status(200).json({
                message: "Conversation exist!",
                conversation: conversationExist,
            });
            return;
        }
        const conversation = await Conversation_1.ConversationModel.create({
            members: [user._id, user2._id],
        });
        await user.updateOne({ $push: { conversations: conversation._id } }).exec();
        await user2
            .updateOne({ $push: { conversations: conversation._id } })
            .exec();
        res
            .status(200)
            .json({ message: "Conversation created successfully!", conversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.CreateConversationController = CreateConversationController;
const GetConservationsController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversations = await Conversation_1.ConversationModel.find({
            members: { $in: [user._id] },
        }).populate({
            path: "members",
            select: "name userName profileImage",
        });
        res.status(200).json({ message: "Conversations found!", conversations });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetConservationsController = GetConservationsController;
const GetConservationController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversationId = req.params.id;
        const conversation = await Conversation_1.ConversationModel.findOne({
            _id: conversationId,
            members: { $in: [user._id] },
        }).populate([
            {
                path: "members",
                select: "name userName profileImage",
            },
            {
                path: "messages",
                populate: [
                    {
                        path: "sender",
                        select: "name userName profileImage",
                    },
                    {
                        path: "recieve",
                        select: "name userName profileImage",
                    },
                ],
                options: {
                    limit: 20,
                    sort: { createdAt: -1 },
                },
            },
        ]);
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found!" });
            return;
        }
        res.status(200).json({ message: "Conversation found!", conversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetConservationController = GetConservationController;
const SendMessageController = async (req, res) => {
    try {
        const email = req.get("email");
        const conversationId = req.params.id;
        const { message, messageMedia, recieverId } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const reciever = await User_1.default.findOne({ _id: recieverId });
        if (!reciever) {
            res.status(404).json({ message: "Reciever not found!" });
            return;
        }
        const conversation = await Conversation_1.ConversationModel.findOne({
            _id: conversationId,
            members: { $in: [user._id] },
        });
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found!" });
            return;
        }
        const newMessage = await Conversation_1.MessageModel.create({
            conversationId,
            message,
            messageMedia,
            sender: user._id,
            reciever: reciever._id,
        });
        await conversation.updateOne({
            $push: { messages: newMessage._id },
        });
        res.status(200).json({ message: "Message sent successfully!", newMessage });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.SendMessageController = SendMessageController;
