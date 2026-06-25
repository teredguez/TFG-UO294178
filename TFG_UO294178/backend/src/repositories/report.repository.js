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
    WHERE user_id = $1 AND status = 'completed'
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

async function getUserReportSummary(userId) {
  const query = `
    SELECT 
      COUNT(*) AS total_reports,
      COUNT(DISTINCT patient_code) AS total_patients,
      MAX(created_at) AS last_report_date
    FROM reports
    WHERE user_id = $1
  `;

  const result = await db.query(query, [userId]);
  return result.rows[0];
}

async function getRecentReportsByUser(userId) {
  const query = `
    SELECT id, patient_code, diagnosis, surgery, decision, list_date, created_at, form_data
    FROM reports
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
}

//Gestión de los borradores de los informes
async function createDraft({
  userId,
  patientCode,
  diagnosis,
  surgery,
  decision,
  listDate,
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
      form_data,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft')
    RETURNING *
  `;

  const values = [
    userId,
    patientCode || `BOR-${Date.now()}`,
    diagnosis || null,
    surgery || null,
    decision || null,
    listDate || null,
    null,
    null,
    formData
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

async function updateDraft({
  draftId,
  userId,
  diagnosis,
  surgery,
  decision,
  listDate,
  formData
}) {
  const query = `
    UPDATE reports
    SET
      diagnosis = $1,
      surgery = $2,
      decision = $3,
      list_date = $4,
      form_data = $5,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
      AND user_id = $7
      AND status = 'draft'
    RETURNING *
  `;

  const values = [
    diagnosis,
    surgery,
    decision,
    listDate || null,
    formData,
    draftId,
    userId
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
}

async function getDraftsByUser(userId) {
  const query = `
    SELECT id, patient_code, diagnosis, surgery, decision, list_date, created_at, updated_at
    FROM reports
    WHERE user_id = $1
      AND status = 'draft'
    ORDER BY updated_at DESC
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
}

async function getDraftById(draftId, userId) {
  const query = `
    SELECT *
    FROM reports
    WHERE id = $1
      AND user_id = $2
      AND status = 'draft'
  `;

  const result = await db.query(query, [draftId, userId]);
  return result.rows[0] || null;
}

async function completeDraft({
  draftId,
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
    UPDATE reports
    SET
      patient_code = $1,
      diagnosis = $2,
      surgery = $3,
      decision = $4,
      list_date = $5,
      pdf_filename = $6,
      pdf_path = $7,
      form_data = $8,
      status = 'completed',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
      AND user_id = $10
      AND status = 'draft'
    RETURNING *
  `;

  const values = [
    patientCode,
    diagnosis,
    surgery,
    decision,
    listDate || null,
    pdfFilename,
    pdfPath,
    formData,
    draftId,
    userId
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
}

async function deleteDraft(draftId, userId) {
  const query = `
    DELETE FROM reports
    WHERE id = $1
      AND user_id = $2
      AND status = 'draft'
    RETURNING *
  `;

  const result = await db.query(query, [draftId, userId]);
  return result.rows[0] || null;
}

async function deleteReport(reportId, userId) {
  const query = `
    DELETE FROM reports
    WHERE id = $1
      AND user_id = $2
      AND status = 'completed'
    RETURNING *
  `;

  const result = await db.query(query, [
    reportId,
    userId
  ]);

  return result.rows[0] || null;
}

async function getAsaDistribution(userId) {
  const query = `
    SELECT form_data
    FROM reports
    WHERE user_id = $1
      AND status = 'completed'
  `;

  const result = await db.query(query, [userId]);

  const stats = {
    I: 0,
    II: 0,
    III: 0,
    IV: 0,
    V: 0,
  };

  result.rows.forEach((row) => {
    const asa = row.form_data?.score_asa;

    if (stats[asa] !== undefined) {
      stats[asa]++;
    }
  });

  return stats;
}

module.exports = {
  createReport,
  getReportsByUser,
  getReportById,
  getUserReportSummary,
  getRecentReportsByUser,
  createDraft,
  updateDraft,
  getDraftsByUser,
  getDraftById,
  completeDraft,
  deleteDraft,
  deleteReport,
  getAsaDistribution
};