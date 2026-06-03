const pool = require('../config/db');

const getAllInterviews = async (userID, filters = {}) => {
  let query = `
    SELECT i.*, j.companyName, j.jobTitle
    FROM Interview i
    JOIN Job j ON i.jobID = j.jobID
    WHERE j.userID = ?
  `;

  const params = [userID];

  if (filters.result) {
    query += 'AND i.result = ? ';
    params.push(filters.result);
  }

  if (filters.interviewType) {
    query += 'AND i.interviewType = ? ';
    params.push(filters.interviewType);
  }

  query += 'ORDER BY interviewDate DESC';

  const [rows] = await pool.query(query, params);

  return rows;
};

const getInterviewsByJobId = async (jobID, userID) => {
  const [rows] = await pool.query(
    `SELECT i.*, j.companyName, j.jobTitle
     FROM Interview i
     JOIN Job j ON i.jobID = j.jobID
     WHERE i.jobID = ? AND j.userID = ?
     ORDER BY i.interviewDate DESC`,
    [jobID, userID]
  );

  return rows;
};

const getInterviewById = async (interviewID, userID) => {
  const [rows] = await pool.query(
    `SELECT i.*, j.companyName, j.jobTitle
     FROM Interview i
     JOIN Job j ON i.jobID = j.jobID
     WHERE i.interviewID = ? AND j.userID = ?`,
    [interviewID, userID]
  );

  return rows[0];
};

const createInterview = async (userID, data) => {
  const { jobID, interviewDate, interviewType, interviewNotes, result } = data;

  const [jobRows] = await pool.query(
    'SELECT jobID FROM Job WHERE jobID = ? AND userID = ?',
    [jobID, userID]
  );

  if (!jobRows.length) {
    return null;
  }

  const [resultData] = await pool.query(
    `INSERT INTO Interview (
      jobID,
      interviewDate,
      interviewType,
      interviewNotes,
      result,
      userID
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
    [jobID, interviewDate, interviewType, interviewNotes, result, userID]
  );

  return {
    interviewID: resultData.insertId,
    ...data,
  };
};

const updateInterview = async (interviewID, userID, data) => {
  const { interviewDate, interviewType, interviewNotes, result } = data;

  const [resultData] = await pool.query(
    `UPDATE Interview i
     JOIN Job j ON i.jobID = j.jobID
     SET i.interviewDate = ?,
         i.interviewType = ?,
         i.interviewNotes = ?,
         i.result = ?
     WHERE i.interviewID = ? AND j.userID = ?`,
    [interviewDate, interviewType, interviewNotes, result, interviewID, userID]
  );

  if (resultData.affectedRows === 0) {
    return null;
  }

  return {
    interviewID,
    ...data,
  };
};

const deleteInterview = async (interviewID, userID) => {
  const [resultData] = await pool.query(
    `DELETE i
     FROM Interview i
     JOIN Job j ON i.jobID = j.jobID
     WHERE i.interviewID = ? AND j.userID = ?`,
    [interviewID, userID]
  );

  if (resultData.affectedRows === 0) {
    return null;
  }

  return {
    message: `Interview with ID ${interviewID} deleted successfully.`,
  };
};

module.exports = {
  getAllInterviews,
  getInterviewsByJobId,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
};