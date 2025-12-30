function Schedule() {
  // mock data
  const schedules = [
    { time: "08:00", patient: "Nguyen Van A" },
    { time: "09:00", patient: "Tran Thi B" },
  ];

  return (
    <div>
      <h2>Lịch khám hôm nay</h2>

      <ul>
        {schedules.map((s, idx) => (
          <li key={idx}>
            {s.time} – {s.patient}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Schedule;
