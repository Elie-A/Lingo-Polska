import Exercise from "../models/Exercise.js";

// Get all exercises with optional filters
export const getExercises = async (req, res) => {
  try {
    const {
      topic,
      type,
      level,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build dynamic case-insensitive query
    const query = {};
    if (topic) query.topic = { $regex: new RegExp(`^${topic}$`, "i") };
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (level) query.level = { $regex: new RegExp(`^${level}$`, "i") };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch exercises
    const exercises = await Exercise.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    // Total count
    const total = await Exercise.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: exercises,
      pagination: {
        total,
        totalPages,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single exercise by ID
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);
    if (!exercise)
      return res
        .status(404)
        .json({ success: false, message: "Exercise not found" });

    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a random exercise with optional filters
export const getRandomExercise = async (req, res) => {
  try {
    const { topic, type, level } = req.query;

    // Build dynamic query
    const query = {};
    if (topic) query.topic = topic;
    if (type) query.type = type;
    if (level) query.level = level;

    // Count matching documents
    const count = await Exercise.countDocuments(query);
    if (count === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No exercises found" });
    }

    // Pick a random skip
    const randomIndex = Math.floor(Math.random() * count);

    const exercise = await Exercise.findOne(query).skip(randomIndex);

    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get distinct values for filters
export const getFilters = async (req, res) => {
  try {
    const topics = await Exercise.distinct("topic");
    const types = await Exercise.distinct("type");
    const levels = await Exercise.distinct("level");

    res.status(200).json({
      success: true,
      data: { topics, types, levels },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
