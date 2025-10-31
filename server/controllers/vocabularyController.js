import Vocabulary from "../models/Vocabulary.js";

const validateVocabulary = ({ polish, english, category, level }) => {
  if (!polish || !english || !category || !level) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }
};

/** GET /api/vocabulary */
export const getAllVocabularies = async (req, res) => {
  try {
    const { level } = req.query;
    const match = level ? { level } : {};

    const groupedVocab = await Vocabulary.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          words: {
            $push: {
              _id: "$_id",
              polish: "$polish",
              english: "$english",
              level: "$level",
              createdAt: "$createdAt",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(groupedVocab);
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed to fetch vocabulary" });
  }
};

/** POST /api/vocabulary */
export const addVocabulary = async (req, res) => {
  try {
    validateVocabulary(req.body);
    const savedWord = await Vocabulary.create(req.body);
    res.status(201).json(savedWord);
  } catch (error) {
    console.error("Error adding vocabulary:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed to add vocabulary" });
  }
};

/** DELETE /api/vocabulary/:id */
export const deleteVocabulary = async (req, res) => {
  try {
    const deleted = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Word not found" });
    res.status(200).json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Error deleting vocabulary:", error);
    res.status(500).json({ message: "Failed to delete vocabulary" });
  }
};
