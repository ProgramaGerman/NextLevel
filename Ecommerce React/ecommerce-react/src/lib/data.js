import { supabase } from "../env/KeySupabase";

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} instructor
 * @property {string} description
 * @property {string} image
 * @property {number} price
 * @property {number} originalPrice
 * @property {number} rating
 * @property {number} reviews
 * @property {number} students
 * @property {string} category
 * @property {string} [badge]
 * @property {string} [instagramUrl]
 * @property {number} [lessons]
 * @property {number} [hours]
 * @property {string} [level]
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {number} count
 */

/** Convierte snake_case de Supabase a camelCase del frontend */
const mapCourse = (row) => ({
  id: row.id,
  title: row.title,
  instructor: row.instructor,
  description: row.description,
  image: row.image,
  price: row.price,
  originalPrice: row.original_price,
  rating: row.rating,
  reviews: row.reviews,
  students: row.students,
  category: row.category,
  badge: row.badge,
  instagramUrl: row.instagram_url,
  lessons: row.lessons,
  hours: row.hours,
  level: row.level,
});

// ============================================================
// CURSOS
// ============================================================

/** @returns {Promise<Course[]>} */
export const getCourses = async () => {
  const { data, error } = await supabase.from("courses").select("*");
  if (error) { console.error("Error al obtener cursos:", error); return []; }
  return data.map(mapCourse);
};

/** @returns {Promise<Course|null>} */
export const getCourseById = async (id) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) { console.error("Error al obtener curso:", error); return null; }
  return mapCourse(data);
};

/**
 * @param {string} category
 * @param {number} [limit]
 * @returns {Promise<Course[]>}
 */
export const getCoursesByCategory = async (category, limit) => {
  let query = supabase.from("courses").select("*").eq("category", category);
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) { console.error("Error al filtrar cursos:", error); return []; }
  return data.map(mapCourse);
};

/**
 * @param {string} courseId
 * @param {number} [limit=3]
 * @returns {Promise<Course[]>}
 */
export const getRelatedCourses = async (courseId, limit = 3) => {
  const course = await getCourseById(courseId);
  if (!course) return [];
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("category", course.category)
    .neq("id", courseId)
    .limit(limit);
  if (error) { console.error("Error al obtener cursos relacionados:", error); return []; }
  return data.map(mapCourse);
};

/** Curso destacado: el de mayor número de estudiantes */
export const getFeaturedCourse = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("students", { ascending: false })
    .limit(1)
    .single();
  if (error) { console.error("Error al obtener curso destacado:", error); return null; }
  return mapCourse(data);
};

// ============================================================
// CATEGORÍAS
// ============================================================

/** @returns {Promise<Category[]>} */
export const getCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) { console.error("Error al obtener categorías:", error); return []; }
  return data;
};
