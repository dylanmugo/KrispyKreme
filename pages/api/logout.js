import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(async function logoutRoute(req, res) {
  req.session.destroy();
  res.status(200).json({ message: "Logged out successfully" });
});
