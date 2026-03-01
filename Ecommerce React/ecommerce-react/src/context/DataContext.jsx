import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../env/KeySupabase";

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData debe usarse dentro de DataProvider");
  return context;
};

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // ──────────────────────────────────────────
  // USUARIOS
  // ──────────────────────────────────────────
  const createUser = async (userData) => {
    const newUser = {
      id: `user_${Date.now()}`,
      created_at: new Date().toISOString(),
      cedula: userData.cedula,
      name: userData.name,
      email: userData.email,
    };
    const { data, error } = await supabase.from("users").insert(newUser).select().single();
    if (error) { console.error("Error al crear usuario:", error); return null; }
    return data;
  };

  const getUserByCedula = async (cedula) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("cedula", cedula)
      .single();
    if (error) return null;
    return data;
  };

  const updateUser = async (userId, updates) => {
    const { error } = await supabase.from("users").update(updates).eq("id", userId);
    if (error) console.error("Error al actualizar usuario:", error);
  };

  // ──────────────────────────────────────────
  // ENROLLMENTS (inscripciones)
  // ──────────────────────────────────────────
  const createEnrollment = async (enrollmentData) => {
    const newEnrollment = {
      id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "not_started",
      progress: 0,
      score: 0,
      created_at: new Date().toISOString(),
      completed_at: null,
      user_id: enrollmentData.userId,
      course_id: enrollmentData.courseId,
      ...enrollmentData,
    };
    const { data, error } = await supabase.from("enrollments").insert(newEnrollment).select().single();
    if (error) { console.error("Error al crear inscripción:", error); return null; }
    return data;
  };

  const updateEnrollment = async (enrollmentId, updates) => {
    const { error } = await supabase.from("enrollments").update(updates).eq("id", enrollmentId);
    if (error) console.error("Error al actualizar inscripción:", error);
  };

  const getUserEnrollments = async (userId) => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId);
    if (error) { console.error("Error al obtener inscripciones:", error); return []; }
    return data;
  };

  const getEnrollmentByCourse = async (userId, courseId) => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();
    if (error) return null;
    return data;
  };

  // ──────────────────────────────────────────
  // PAYMENTS (pagos)
  // ──────────────────────────────────────────
  const createPayment = async (paymentData) => {
    const newPayment = {
      id: `payment_${Date.now()}`,
      created_at: new Date().toISOString(),
      user_id: paymentData.userId,
      course_id: paymentData.courseId,
      amount: paymentData.amount,
      ...paymentData,
    };
    const { data, error } = await supabase.from("payments").insert(newPayment).select().single();
    if (error) { console.error("Error al crear pago:", error); return null; }
    return data;
  };

  const getUserPayments = async (userId) => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId);
    if (error) { console.error("Error al obtener pagos:", error); return []; }
    return data;
  };

  // ──────────────────────────────────────────
  // REVIEWS (opiniones globales)
  // ──────────────────────────────────────────
  const createReview = async (reviewData) => {
    const newReview = {
      id: `review_${Date.now()}`,
      created_at: new Date().toISOString(),
      user_id: reviewData.userId,
      rating: reviewData.rating,
      comment: reviewData.comment,
    };
    const { data, error } = await supabase.from("reviews").insert(newReview).select().single();
    if (error) { console.error("Error al crear reseña:", error); return null; }
    return data;
  };

  const getReviews = async () => {
    const { data, error } = await supabase.from("reviews").select("*");
    if (error) { console.error("Error al obtener reseñas:", error); return []; }
    return data;
  };

  // ──────────────────────────────────────────
  // COURSE COMMENTS (comentarios por curso)
  // ──────────────────────────────────────────
  const createCourseComment = async (commentData) => {
    const newComment = {
      id: `comment_${Date.now()}`,
      created_at: new Date().toISOString(),
      user_id: commentData.userId,
      course_id: commentData.courseId,
      comment: commentData.comment,
    };
    const { data, error } = await supabase.from("course_comments").insert(newComment).select().single();
    if (error) { console.error("Error al crear comentario:", error); return null; }
    return data;
  };

  const getCourseComments = async (courseId) => {
    const { data, error } = await supabase
      .from("course_comments")
      .select("*")
      .eq("course_id", courseId);
    if (error) { console.error("Error al obtener comentarios:", error); return []; }
    return data;
  };

  // ──────────────────────────────────────────
  // ESTADÍSTICAS
  // ──────────────────────────────────────────
  const getStats = async () => {
    const [{ count: totalUsers }, { count: totalEnrollments }, { count: totalCompletions }, reviews] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("reviews").select("rating"),
    ]);
    const avgRating = reviews.data?.length > 0
      ? (reviews.data.reduce((sum, r) => sum + r.rating, 0) / reviews.data.length).toFixed(1)
      : 0;
    return { totalUsers, totalEnrollments, totalCompletions, averageRating: avgRating };
  };

  const value = {
    loading,
    // Users
    createUser,
    getUserByCedula,
    updateUser,
    // Enrollments
    createEnrollment,
    updateEnrollment,
    getUserEnrollments,
    getEnrollmentByCourse,
    // Payments
    createPayment,
    getUserPayments,
    // Reviews
    createReview,
    getReviews,
    // Comments
    createCourseComment,
    getCourseComments,
    // Stats
    getStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
