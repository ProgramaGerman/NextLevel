/**
 * TEST SUPABASE — NextLevel Ecommerce
 * Ejecutar con: node test-supabase.js
 *
 * Prueba todas las secciones de la integración:
 *  1. Conexión a Supabase
 *  2. Cursos (getCourses, getCourseById, getCoursesByCategory, getRelatedCourses, getFeaturedCourse)
 *  3. Categorías (getCategories)
 *  4. Usuarios   (createUser, getUserByCedula, updateUser)
 *  5. Inscripciones (createEnrollment, getUserEnrollments, getEnrollmentByCourse, updateEnrollment)
 *  6. Pagos      (createPayment, getUserPayments)
 *  7. Reseñas    (createReview, getReviews)
 *  8. Comentarios (createCourseComment, getCourseComments)
 *  9. Limpieza   (borra los datos de prueba)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tcojjbbrojbqohitvtxu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjb2pqYmJyb2picW9oaXR2dHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzc2MDMsImV4cCI6MjA4Nzk1MzYwM30.k0xRHwpdSivr23dauExRs6dMxN2ahS1GK0etuW6xMI4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Utilidades de log ────────────────────────────────────────────────────────
const OK  = (msg) => console.log(`  ✅ ${msg}`);
const ERR = (msg) => console.error(`  ❌ ${msg}`);
const SEC = (title) => console.log(`\n${"─".repeat(50)}\n🔷 ${title}\n${"─".repeat(50)}`);

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { OK(msg); passed++; }
  else           { ERR(msg); failed++; }
}

// ─── 1. Conexión ─────────────────────────────────────────────────────────────
SEC("1. Conexión a Supabase");
const { data: pingData, error: pingError } = await supabase
  .from("courses")
  .select("id")
  .limit(1);
assert(!pingError, `Conexión exitosa (pingError: ${pingError?.message ?? "none"})`);

// ─── 2. Cursos ────────────────────────────────────────────────────────────────
SEC("2. Cursos");

const { data: allCourses, error: e1 } = await supabase.from("courses").select("*");
assert(!e1 && allCourses?.length > 0, `getCourses → ${allCourses?.length ?? 0} cursos encontrados`);

const { data: courseById, error: e2 } = await supabase
  .from("courses").select("*").eq("id", "7").single();
assert(!e2 && courseById?.title, `getCourseById('7') → "${courseById?.title}"`);

const { data: byCat, error: e3 } = await supabase
  .from("courses").select("*").eq("category", "illustration");
assert(!e3 && byCat?.length > 0, `getCoursesByCategory('illustration') → ${byCat?.length ?? 0} cursos`);

const { data: featured, error: e4 } = await supabase
  .from("courses").select("*").order("students", { ascending: false }).limit(1).single();
assert(!e4 && featured, `getFeaturedCourse → "${featured?.title}"`);

// Usamos curso '1' (illustration) que tiene 3 relacionados; el '7' (design) es único en su categoría
const refCourse = allCourses?.find(c => c.category === "illustration");
const { data: related, error: e5 } = await supabase
  .from("courses").select("*")
  .eq("category", "illustration")
  .neq("id", refCourse?.id)
  .limit(3);
assert(!e5 && related?.length > 0, `getRelatedCourses(illustration) → ${related?.length ?? 0} relacionados`);

// ─── 3. Categorías ───────────────────────────────────────────────────────────
SEC("3. Categorías");

const { data: cats, error: e6 } = await supabase.from("categories").select("*");
assert(!e6 && cats?.length === 8, `getCategories → ${cats?.length ?? 0} categorías (esperadas: 8)`);

// ─── 4. Usuarios ─────────────────────────────────────────────────────────────
SEC("4. Usuarios");

const testUser = {
  id: `user_test_${Date.now()}`,
  cedula: `TEST-${Date.now()}`,
  name: "Usuario Test",
  email: "test@nextlevel.com",
  created_at: new Date().toISOString(),
};

const { data: createdUser, error: e7 } = await supabase
  .from("users").insert(testUser).select().single();
assert(!e7 && createdUser?.id === testUser.id, `createUser → id: ${createdUser?.id}`);

const { data: foundUser, error: e8 } = await supabase
  .from("users").select("*").eq("cedula", testUser.cedula).single();
assert(!e8 && foundUser?.name === "Usuario Test", `getUserByCedula → "${foundUser?.name}"`);

const { error: e9 } = await supabase
  .from("users").update({ name: "Usuario Actualizado" }).eq("id", testUser.id);
assert(!e9, `updateUser → sin error`);

const { data: updatedUser } = await supabase
  .from("users").select("name").eq("id", testUser.id).single();
assert(updatedUser?.name === "Usuario Actualizado", `updateUser → nombre: "${updatedUser?.name}"`);

// ─── 5. Inscripciones ────────────────────────────────────────────────────────
SEC("5. Inscripciones");

const testEnrollment = {
  id: `enrollment_test_${Date.now()}`,
  user_id: testUser.id,
  course_id: "1",
  status: "not_started",
  progress: 0,
  score: 0,
  created_at: new Date().toISOString(),
};

const { data: createdEnroll, error: e10 } = await supabase
  .from("enrollments").insert(testEnrollment).select().single();
assert(!e10 && createdEnroll?.id === testEnrollment.id, `createEnrollment → id: ${createdEnroll?.id}`);

const { data: userEnrollments, error: e11 } = await supabase
  .from("enrollments").select("*").eq("user_id", testUser.id);
assert(!e11 && userEnrollments?.length > 0, `getUserEnrollments → ${userEnrollments?.length ?? 0} inscripción(es)`);

const { data: singleEnroll, error: e12 } = await supabase
  .from("enrollments").select("*")
  .eq("user_id", testUser.id).eq("course_id", "1").single();
assert(!e12 && singleEnroll, `getEnrollmentByCourse('1') → encontrada`);

const { error: e13 } = await supabase
  .from("enrollments").update({ progress: 50, status: "in_progress" }).eq("id", testEnrollment.id);
assert(!e13, `updateEnrollment → sin error`);

// ─── 6. Pagos ────────────────────────────────────────────────────────────────
SEC("6. Pagos");

const testPayment = {
  id: `payment_test_${Date.now()}`,
  user_id: testUser.id,
  course_id: "1",
  amount: 5.99,
  created_at: new Date().toISOString(),
};

const { data: createdPayment, error: e14 } = await supabase
  .from("payments").insert(testPayment).select().single();
assert(!e14 && createdPayment?.amount == 5.99, `createPayment → monto: $${createdPayment?.amount}`);

const { data: userPayments, error: e15 } = await supabase
  .from("payments").select("*").eq("user_id", testUser.id);
assert(!e15 && userPayments?.length > 0, `getUserPayments → ${userPayments?.length ?? 0} pago(s)`);

// ─── 7. Reseñas ──────────────────────────────────────────────────────────────
SEC("7. Reseñas");

const testReview = {
  id: `review_test_${Date.now()}`,
  user_id: testUser.id,
  rating: 4.5,
  comment: "Excelente plataforma de prueba",
  created_at: new Date().toISOString(),
};

const { data: createdReview, error: e16 } = await supabase
  .from("reviews").insert(testReview).select().single();
assert(!e16 && createdReview?.rating == 4.5, `createReview → rating: ${createdReview?.rating}`);

const { data: allReviews, error: e17 } = await supabase.from("reviews").select("*");
assert(!e17 && allReviews?.length > 0, `getReviews → ${allReviews?.length ?? 0} reseña(s)`);

// ─── 8. Comentarios por curso ────────────────────────────────────────────────
SEC("8. Comentarios por curso");

const testComment = {
  id: `comment_test_${Date.now()}`,
  user_id: testUser.id,
  course_id: "1",
  comment: "Este comentario es de prueba",
  created_at: new Date().toISOString(),
};

const { data: createdComment, error: e18 } = await supabase
  .from("course_comments").insert(testComment).select().single();
assert(!e18 && createdComment?.comment, `createCourseComment → "${createdComment?.comment}"`);

const { data: courseComments, error: e19 } = await supabase
  .from("course_comments").select("*").eq("course_id", "1");
assert(!e19 && courseComments?.length > 0, `getCourseComments('1') → ${courseComments?.length ?? 0} comentario(s)`);

// ─── 9. Limpieza ─────────────────────────────────────────────────────────────
SEC("9. Limpieza de datos de prueba");

await supabase.from("course_comments").delete().eq("user_id", testUser.id);
await supabase.from("reviews").delete().eq("user_id", testUser.id);
await supabase.from("payments").delete().eq("user_id", testUser.id);
await supabase.from("enrollments").delete().eq("user_id", testUser.id);
const { error: cleanErr } = await supabase.from("users").delete().eq("id", testUser.id);
assert(!cleanErr, `Datos de prueba eliminados correctamente`);

// ─── Resumen ─────────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(50)}`);
console.log(`📊 RESULTADO: ${passed} pasaron ✅  |  ${failed} fallaron ❌`);
console.log(`${"═".repeat(50)}\n`);

if (failed > 0) {
  console.log("⚠️  Algunos tests fallaron. Verifica:");
  console.log("   1. Que ejecutaste supabase_migration.sql en Supabase");
  console.log("   2. Que las API keys son correctas");
  console.log("   3. Que las políticas RLS permiten acceso anónimo\n");
  process.exit(1);
} else {
  console.log("🎉 ¡Todo listo! La integración con Supabase funciona correctamente.\n");
}
