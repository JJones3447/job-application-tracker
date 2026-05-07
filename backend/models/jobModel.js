const pool = require('../config/db');

const getAllJobs = async (userID) => {
    const [rows] = await pool.query('SELECT * FROM Job WHERE userID = ? ORDER BY applicationDate DESC',
      [userID]
    );
    return rows;
};

const getJobById = async (jobID, userID) => {
    const [rows] = await pool.query('SELECT * FROM Job WHERE jobID = ? AND userID = ?', [jobID, userID]);
    return rows[0];
};

const createJob = async (jobData) => {
  const {
    userID, companyName, jobTitle, listedSalary, location, technologies,
    jobURL, applicationDate, status, notes} = jobData;
  const [result] = await pool.query(
    `INSERT INTO Job (userID, companyName, jobTitle, listedSalary, location,
    technologies, jobURL, applicationDate, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userID, companyName, jobTitle, listedSalary, location, technologies,
      jobURL, applicationDate, status, notes]
  );
  return {
    jobID: result.insertId, userID, companyName, jobTitle,
    listedSalary, location, technologies, jobURL, applicationDate, status, notes
  };
};

const updateJob = async (jobID, userID, jobData) => {
  const { companyName, jobTitle, listedSalary, location, technologies,
    jobURL, applicationDate, status, notes,
  } = jobData;

  const [result] = await pool.query(
    `UPDATE Job
     SET companyName = ?, jobTitle = ?, listedSalary = ?, location = ?, technologies = ?,
         jobURL = ?, applicationDate = ?, status = ?, notes = ?
     WHERE jobID = ? AND userID = ?`,
    [ companyName, jobTitle, listedSalary, location, technologies,
      jobURL, applicationDate, status, notes, jobID,userID, ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return { jobID, userID, ...jobData };
};

const deleteJob = async (jobID, userID) => {
  const [result] = await pool.query(
    'DELETE FROM Job WHERE jobID = ? AND userID = ?',
    [jobID, userID]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return { message: `Job with ID ${jobID} deleted successfully.` };
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
