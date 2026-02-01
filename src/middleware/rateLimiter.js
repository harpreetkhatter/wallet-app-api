import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const result = await ratelimit.limit(req.ip);
    if (!result.success) {
      return res.status(429).json({ message: "Too many requests. Please try again later" });
    }
    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default rateLimiter;