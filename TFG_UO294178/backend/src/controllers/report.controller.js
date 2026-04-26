const reportRepository = require('../repositories/report.repository');
const path = require('path');

function generatePatientCode() {
  return `PAC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return null;
}

async function createReport(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }

    const { diagnosis, surgery, decision, listDate, formData } = req.body;

    const parsedFormData = formData ? JSON.parse(formData) : {};

    const report = await reportRepository.createReport({
      userId: req.user.id,
      patientCode: generatePatientCode(),
      diagnosis: diagnosis || null,
      surgery: surgery || null,
      decision: decision || null,
      listDate: listDate || null,
      pdfFilename: req.file.filename,
      pdfPath: req.file.path,
      formData: parsedFormData
    });

    return res.status(201).json({
      message: 'Informe guardado correctamente.',
      report
    });
  } catch (error) {
    return next(error);
  }
}

async function getMyReports(req, res, next) {
  try {
    const reports = await reportRepository.getReportsByUser(req.user.id);

    return res.json({
      reports
    });
  } catch (error) {
    return next(error);
  }
}


async function viewReport(req, res, next) {
  try {
    const reportId = req.params.id;
    const report = await reportRepository.getReportById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Informe no encontrado.' });
    }

    if (Number(report.user_id) !== Number(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para acceder a este informe.' });
    }

    const absolutePath = path.resolve(report.pdf_path);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${report.pdf_filename}"`);

    return res.sendFile(absolutePath);
  } catch (error) {
    return next(error);
  }
}

async function getProfileActivity(req, res, next) {
  try {
    const summary = await reportRepository.getUserReportSummary(req.user.id);
    const recentReports = await reportRepository.getRecentReportsByUser(req.user.id);

    return res.json({
      summary,
      recentReports
    });
  } catch (error) {
    return next(error);
  }
}

//Borradores
async function saveDraft(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      draftId,
      patientCode,
      diagnosis,
      surgery,
      decision,
      listDate,
      formData
    } = req.body;

    let draft;

    if (draftId) {
      draft = await reportRepository.updateDraft({
        draftId,
        userId,
        diagnosis,
        surgery,
        decision,
        listDate,
        formData
      });
    } else {
      draft = await reportRepository.createDraft({
        userId,
        patientCode,
        diagnosis,
        surgery,
        decision,
        listDate,
        formData
      });
    }

    if (!draft) {
      return res.status(404).json({ message: 'Borrador no encontrado' });
    }

    res.json({
      message: 'Borrador guardado correctamente',
      draft
    });
  } catch (error) {
    next(error);
  }
}

async function getDrafts(req, res, next) {
  try {
    const drafts = await reportRepository.getDraftsByUser(req.user.id);
    res.json(drafts);
  } catch (error) {
    next(error);
  }
}

async function getDraftById(req, res, next) {
  try {
    const draftId = req.params.id;
    const userId = req.user.id;

    const draft = await reportRepository.getDraftById(draftId, userId);

    if (!draft) {
      return res.status(404).json({ error: 'Borrador no encontrado.' });
    }

    res.json(draft);
  } catch (error) {
    next(error);
  }
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

async function completeDraft(req, res, next) {
  try {
    const draftId = req.params.id;
    const userId = req.user.id;

    const data = JSON.parse(req.body.data);
    const file = req.file;

    const completedDraft = await reportRepository.completeDraft({
      draftId,
      userId,
      patientCode:
        data.patientCode ||
        data.patient_code ||
        data.general?.patientCode ||
        `BOR-${Date.now()}`,
      diagnosis: data.diagnosis || data.general?.diagnosis || null,
      surgery: data.surgery || data.general?.surgery || null,
      decision: data.decision || data.conclusion?.decision || null,
      listDate: data.listDate || data.general?.listDate || null,
      pdfFilename: file.filename,
      pdfPath: file.path,
      formData: data
    });

    if (!completedDraft) {
      return res.status(404).json({ error: 'Borrador no encontrado.' });
    }

    res.json({
      message: 'Borrador completado correctamente.',
      report: completedDraft
    });
  } catch (error) {
    next(error);
  }
}

async function deleteDraft(req, res, next) {
  try {
    const draftId = req.params.id;
    const userId = req.user.id;

    const deletedDraft = await reportRepository.deleteDraft(draftId, userId);

    if (!deletedDraft) {
      return res.status(404).json({ error: 'Borrador no encontrado.' });
    }

    res.json({
      message: 'Borrador eliminado correctamente.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReport,
  getMyReports,
  viewReport,
  getProfileActivity,
  saveDraft,
  getDrafts,
  getDraftById,
  completeDraft,
  deleteDraft
};
