import Vocabulary from "../models/Vocabulary.js";

/**
 * @desc Get all vocabulary entries (with optional filters)
 * @route GET /api/vocabulary
 */
export const getAllVocabularies = async (req, res) => {
  try {
    const { level } = req.query; // only level filter, category is handled by grouping
    const match = {};

    if (level) match.level = level;

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
      { $sort: { _id: 1 } }, // sort categories alphabetically
    ]);

    res.status(200).json(groupedVocab);
  } catch (error) {
    console.error("Error fetching grouped vocabulary:", error);
    res.status(500).json({ message: "Failed to fetch vocabulary" });
  }
};

/**
 * @desc Add a new vocabulary word
 * @route POST /api/vocabulary
 */
export const addVocabulary = async (req, res) => {
  try {
    const { polish, english, category, level } = req.body;

    if (!polish || !english || !category || !level) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newWord = new Vocabulary({ polish, english, category, level });
    const savedWord = await newWord.save();

    res.status(201).json(savedWord);
  } catch (error) {
    console.error("Error adding vocabulary:", error);
    res.status(500).json({ message: "Failed to add vocabulary" });
  }
};

/**
 * @desc Delete a vocabulary word
 * @route DELETE /api/vocabulary/:id
 */
export const deleteVocabulary = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vocabulary.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Word not found" });
    res.status(200).json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Error deleting vocabulary:", error);
    res.status(500).json({ message: "Failed to delete vocabulary" });
  }
};
