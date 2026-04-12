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
module.exports = {
  createReport,
  getMyReports,
  viewReport
};
