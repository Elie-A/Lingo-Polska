// src/lessonsLoader.js
// Dynamically import all JSON lesson files
const modules = import.meta.glob("./data/*.json", { eager: true });

export const loadLessons = () => {
  const lessons = [];

  for (const path in modules) {
    const lessonJson = modules[path].default;
    // Derive title from filename or JSON
    const title = lessonJson.class
      ? lessonJson.class.split("-")[0].trim()
      : path.split("/").pop().replace(".json", "");

    lessons.push({
      title,
      description: lessonJson.description || "",
      path: `/lesson/${title.toLowerCase().replace(/\s+/g, "-")}`,
      classes: [lessonJson],
      icon: lessonJson.icon || "📝",
    });
  }

  return lessons;
};
