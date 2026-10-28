import { Request, Response } from "express";
import waitlistService from "./waitlist.service";
import { joinWaitlistSchema } from "./waitlist.validation";

const joinWaitlist = async (req: Request, res: Response) => {
  const parsed = joinWaitlistSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await waitlistService.joinWaitlist(parsed.data);

  return res.status(201).json({
    success: true,
    message: "Successfully joined the waitlist!",
    data: result,
  });
};

const getWaitlist = async (req: Request, res: Response) => {
  const result = await waitlistService.getWaitlist();
  return res.status(200).json({ success: true, data: result });
};

const waitlistController = {
  joinWaitlist,
  getWaitlist,
};

export default waitlistController;
