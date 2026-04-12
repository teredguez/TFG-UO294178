const db = require('../../db');

async function createReport({
  userId,
  patientCode,
  diagnosis,
  surgery,
  decision,
  listDate,
  pdfFilename,
  pdfPath,
  formData
}) {
  const query = `
    INSERT INTO reports (
      user_id,
      patient_code,
      diagnosis,
      surgery,
      decision,
      list_date,
      pdf_filename,
      pdf_path,
      form_data
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    userId,
    patientCode,
    diagnosis,
    surgery,
    decision,
    listDate || null,
    pdfFilename,
    pdfPath,
    formData
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

async function getReportsByUser(userId) {
  const query = `
    SELECT id, patient_code, diagnosis, surgery, decision, list_date, pdf_filename, created_at
    FROM reports
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
}

async function getReportById(reportId) {
  const query = `
    SELECT *
    FROM reports
    WHERE id = $1
  `;

  const result = await db.query(query, [reportId]);
  return result.rows[0] || null;
}

module.exports = {
  createReport,
  getReportsByUser,
  getReportById
};