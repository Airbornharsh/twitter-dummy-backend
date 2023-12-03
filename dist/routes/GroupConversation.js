"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const GroupConversation = (conversation) => {
    const group = (0, express_1.Router)();
    conversation.use("/group", group);
    //admin
    group.post("/", Controllers_1.default.AdminCreateGroupConversationController);
    group.get("/", Controllers_1.default.GetGroupConversationsController);
    group.get("/:id", Controllers_1.default.GetGroupConversationController);
    group.put("/update/:id", Controllers_1.default.AdminUpdateGroupConversationController);
    group.put("/add/:id", Controllers_1.default.AdminAddGroupConversationMemberController);
    group.put("/remove/:id", Controllers_1.default.AdminRemoveGroupConversationMemberController);
    group.put("/admin/:id", Controllers_1.default.AdminAddGroupConversationAdminController);
    group.delete("/admin/:id", Controllers_1.default.AdminRemoveGroupConversationAdminController);
    group.patch("/allow/:id", Controllers_1.default.AdminAllowGroupConversationController);
    group.patch("/deny/:id", Controllers_1.default.AdminDenyGroupConversationController);
    group.delete("/:id", Controllers_1.default.AdminDeleteGroupConversationController);
    group.put("/leave/:id", Controllers_1.default.LeaveGroupConversationController);
    group.put("/join/:id", Controllers_1.default.JoinGroupConversationController);
    group.post("/message/:id", Controllers_1.default.SendMessageToGroupConversationController);
    // group.patch("/read/:id", Controllers.ReadGroupMessageController);
};
exports.default = GroupConversation;
