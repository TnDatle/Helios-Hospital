export const searchPatientsApi = async (query) => {

  const res = await fetch(
    `http://localhost:5000/api/appointments/patients/search?q=${query}`
  );

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
};

export const createAppointmentApi = async (data) => {

  const res = await fetch(
    "http://localhost:5000/api/appointments/walkin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  if (!res.ok) {
    throw new Error("Create appointment failed");
  }

  return res.json();
};