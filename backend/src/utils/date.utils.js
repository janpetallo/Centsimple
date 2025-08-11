function getDateRange(dateRangeString) {
  const now = new Date();
  let startDate;
  let endDate; // Use an end date for specific ranges

  switch (dateRangeString) {
    case 'last7days':
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      break;
    case 'last30days':
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
      break;
    case 'last90days':
      startDate = new Date();
      startDate.setDate(now.getDate() - 90);
      break;
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'lastMonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'lastYear':
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return {}; // Return empty object if no valid range is provided
  }

  const whereClause = {};
  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
    whereClause.gte = startDate;
  }
  if (endDate) {
    whereClause.lt = endDate;
  }

  return whereClause;
}

module.exports = {
  getDateRange,
};
