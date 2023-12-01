import { Router } from "express";
import Controllers from "../controllers/Controllers";

const Conservation = (user: Router) => {
  const conservation = Router();

  user.use("/conversation", conservation);

  conservation.post("/", Controllers.CreateConversationController);
  conservation.get("/", Controllers.GetConservationsController);
  conservation.get("/:id", Controllers.GetConservationController);
  conservation.put("/send/:id", Controllers.SendMessageController);
  // conservation.delete("/:id", Controllers.DeleteConservationController);
}

export default Conservation;