export const generateQueueNumber = async (departmentId) => {

  const prefix = departmentId.substring(0, 2).toUpperCase();

  const random = Math.floor(Math.random() * 900) + 100;

  return `${prefix}${random}`;
};