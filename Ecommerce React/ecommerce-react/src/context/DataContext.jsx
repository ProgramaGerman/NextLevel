import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    enrollments: [],
    payments: [],
    reviews: [],
    courseComments: [],
  });

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem("lms_data");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }
  }, []);

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("lms_data", JSON.stringify(data));
  }, [data]);

  // Usuarios
  const createUser = (userData) => {
    const newUser = {
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...userData,
    };
    setData((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
    return newUser;
  };

  const getUserByCedula = (cedula) => {
    return data.users.find((user) => user.cedula === cedula);
  };

  const updateUser = (userId, updates) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === userId ? { ...user, ...updates } : user,
      ),
    }));
  };

  // Enrollments (inscripciones a cursos)
  const createEnrollment = (enrollmentData) => {
    const newEnrollment = {
      id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "not_started",
      progress: 0,
      score: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
      ...enrollmentData,
    };
    setData((prev) => ({
      ...prev,
      enrollments: [...prev.enrollments, newEnrollment],
    }));
    return newEnrollment;
  };

  const updateEnrollment = (enrollmentId, updates) => {
    setData((prev) => ({
      ...prev,
      enrollments: prev.enrollments.map((enrollment) =>
        enrollment.id === enrollmentId
          ? { ...enrollment, ...updates }
          : enrollment,
      ),
    }));
  };

  const getUserEnrollments = (userId) => {
    return data.enrollments.filter(
      (enrollment) => enrollment.userId === userId,
    );
  };

  const getEnrollmentByCourse = (userId, courseId) => {
    return data.enrollments.find(
      (enrollment) =>
        enrollment.userId === userId && enrollment.courseId === courseId,
    );
  };

  // Payments (historial de pagos)
  const createPayment = (paymentData) => {
    const newPayment = {
      id: `payment_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...paymentData,
    };
    setData((prev) => ({
      ...prev,
      payments: [...prev.payments, newPayment],
    }));
    return newPayment;
  };

  const getUserPayments = (userId) => {
    return data.payments.filter((payment) => payment.userId === userId);
  };

  // Reviews (opiniones globales)
  const createReview = (reviewData) => {
    const newReview = {
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...reviewData,
    };
    setData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }));
    return newReview;
  };

  const getReviews = () => {
    return data.reviews;
  };

  // Course Comments (comentarios por curso)
  const createCourseComment = (commentData) => {
    const newComment = {
      id: `comment_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...commentData,
    };
    setData((prev) => ({
      ...prev,
      courseComments: [...prev.courseComments, newComment],
    }));
    return newComment;
  };

  const getCourseComments = (courseId) => {
    return data.courseComments.filter(
      (comment) => comment.courseId === courseId,
    );
  };

  // Estadísticas
  const getStats = () => {
    return {
      totalUsers: data.users.length,
      totalEnrollments: data.enrollments.length,
      totalCompletions: data.enrollments.filter((e) => e.status === "completed")
        .length,
      averageRating:
        data.reviews.length > 0
          ? (
              data.reviews.reduce((sum, r) => sum + r.rating, 0) /
              data.reviews.length
            ).toFixed(1)
          : 0,
    };
  };

  const value = {
    data,
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
