import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, index: true },
  ip: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  endpoint: { type: String, required: true },
  hits: { type: Number, default: 0 },
  resetTime: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

// Compound index
rateLimitSchema.index({ key: 1, endpoint: 1 });

// Static methods
rateLimitSchema.statics.logHit = async function (data) {
  try {
    await this.updateOne(
      { key: data.key, endpoint: data.endpoint },
      {
        $set: { ip: data.ip, userId: data.userId, resetTime: data.resetTime },
        $inc: { hits: 1 },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error logging rate limit hit:", error);
  }
};

rateLimitSchema.statics.getStats = async function (timeRange = 24) {
  const since = new Date(Date.now() - timeRange * 60 * 60 * 1000);

  return await this.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: "$endpoint",
        totalHits: { $sum: "$hits" },
        uniqueIPs: { $addToSet: "$ip" },
        uniqueUsers: { $addToSet: "$userId" },
      },
    },
    {
      $project: {
        endpoint: "$_id",
        totalHits: 1,
        uniqueIPs: { $size: "$uniqueIPs" },
        uniqueUsers: { $size: "$uniqueUsers" },
      },
    },
  ]);
};

const RateLimit = mongoose.model("RateLimit", rateLimitSchema);
export default RateLimit;
