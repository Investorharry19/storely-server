"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waitlist_service_1 = __importDefault(require("./waitlist.service"));
const waitlist_validation_1 = require("./waitlist.validation");
const joinWaitlist = async (req, res) => {
    const parsed = waitlist_validation_1.joinWaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await waitlist_service_1.default.joinWaitlist(parsed.data);
    return res.status(201).json({
        success: true,
        message: "Successfully joined the waitlist!",
        data: result,
    });
};
const getWaitlist = async (req, res) => {
    const result = await waitlist_service_1.default.getWaitlist();
    return res.status(200).json({ success: true, data: result });
};
const waitlistController = {
    joinWaitlist,
    getWaitlist,
};
exports.default = waitlistController;
