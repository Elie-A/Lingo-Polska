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
    const { level, page, limit } = req.query;

    // Build match stage
    const match = {};
    if (level) match.level = level;

    // If pagination is requested
    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const [groupedVocab, totalCount] = await Promise.all([
        Vocabulary.aggregate([
          { $match: match },
          { $sort: { category: 1, polish: 1 } },
          { $skip: skip },
          { $limit: limitNum },
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
        ]).allowDiskUse(true),
        Vocabulary.countDocuments(match),
      ]);

      return res.status(200).json({
        data: groupedVocab,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalItems: totalCount,
          itemsPerPage: limitNum,
        },
      });
    }

    // Default behavior - return all grouped by category
    const groupedVocab = await Vocabulary.aggregate([
      { $match: match },
      {
        $project: {
          _id: 1,
          polish: 1,
          english: 1,
          level: 1,
          category: 1,
          createdAt: 1,
        },
      },
      { $sort: { category: 1, polish: 1 } },
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
    ]).allowDiskUse(true);

    // Set cache headers for better performance
    res.set("Cache-Control", "public, max-age=300"); // Cache for 5 minutes
    res.status(200).json(groupedVocab);
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed to fetch vocabulary" });
  }
};

/** GET /api/vocabulary/search - Optimized search endpoint */
export const searchVocabulary = async (req, res) => {
  try {
    const { q, level, category, page = 1, limit = 50 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build match stage
    const match = {};

    if (q) {
      match.$or = [
        { polish: { $regex: q, $options: "i" } },
        { english: { $regex: q, $options: "i" } },
      ];
    }

    if (level) match.level = level;
    if (category) match.category = category;

    const [results, totalCount] = await Promise.all([
      Vocabulary.find(match)
        .select("_id polish english level category createdAt")
        .sort({ category: 1, polish: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Vocabulary.countDocuments(match),
    ]);

    res.set("Cache-Control", "public, max-age=60"); // Cache for 1 minute
    res.status(200).json({
      data: results,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error("Error searching vocabulary:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed to search vocabulary" });
  }
};

/** GET /api/vocabulary/categories - Get all unique categories */
export const getCategories = async (req, res) => {
  try {
    const categories = await Vocabulary.distinct("category");

    res.set("Cache-Control", "public, max-age=600"); // Cache for 10 minutes
    res.status(200).json(categories.sort());
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
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

/** PUT /api/vocabulary/:id - Update vocabulary */
export const updateVocabulary = async (req, res) => {
  try {
    validateVocabulary(req.body);

    const updated = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Word not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating vocabulary:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed to update vocabulary" });
  }
};

/** DELETE /api/vocabulary/:id */
export const deleteVocabulary = async (req, res) => {
  try {
    const deleted = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Word not found" });
    }
    res.status(200).json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Error deleting vocabulary:", error);
    res.status(500).json({ message: "Failed to delete vocabulary" });
  }
};

/** DELETE /api/vocabulary - Bulk delete */
export const bulkDeleteVocabulary = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Array of IDs is required" });
    }

    const result = await Vocabulary.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: `${result.deletedCount} word(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting vocabulary:", error);
    res.status(500).json({ message: "Failed to delete vocabulary" });
  }
};
