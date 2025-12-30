class Doctor {
  constructor({
    id,
    name,
    specialty,
    role,
    room,
    weekday,
    shiftmorning,
    shiftafternoon,
    department,
  }) {
    this.id = id;
    this.name = name;
    this.specialty = specialty;
    this.role = role;
    this.room = room;
    this.weekday = weekday;
    this.shiftmorning = shiftmorning;
    this.shiftafternoon = shiftafternoon;
    this.department = department;
  }

  // ===== Firestore -> Object =====
  static fromFirestore(doc, department) {
    const d = doc.data();

    return new Doctor({
      id: doc.id,
      name: d.DocName || "",
      specialty: d.specialty || "",
      role: d.role || "",
      room: d.room || "",
      weekday: d.weekday || "",
      shiftmorning: d.shiftmorning || "",
      shiftafternoon: d.shiftafternoon || "",
      department,
    });
  }

  // ===== Response cho LIST =====
  toListJSON() {
    return {
      id: this.id,
      name: this.name,
      specialty: this.specialty,
      role: this.role,
      room: this.room,
      weekday: this.weekday,
      shiftmorning: this.shiftmorning,
      shiftafternoon: this.shiftafternoon,
      department: this.department,
    };
  }

  // ===== Response cho DETAIL =====
  toDetailJSON() {
    const time = [this.shiftmorning, this.shiftafternoon]
      .filter(Boolean)
      .join(" | ");

    return {
      name: this.name,
      specialty: this.specialty,
      role: this.role,
      schedule: {
        day: this.weekday,
        time,
        room: this.room,
        location: "Khu Khám bệnh Trụ sở chính",
      },
    };
  }
}

export default Doctor;
