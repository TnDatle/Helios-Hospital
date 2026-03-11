export const getDepartmentsApi = async () => {

  const res = await fetch("http://localhost:5000/api/departments");

  if (!res.ok) {
    throw new Error("Failed to fetch departments");
  }

  return await res.json();

};

export const getDoctorsByDepartmentApi = async (departmentId) => {

  const res = await fetch(
    `http://localhost:5000/api/doctors?departmentId=${departmentId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return await res.json();

};

// API mới
export const getTodaySlotsApi = async (departmentId) => {
    
  const res = await fetch(
    `http://localhost:5000/api/slots/today?departmentId=${departmentId}`
  );
  return res.json();
};