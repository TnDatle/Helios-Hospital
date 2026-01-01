// utils/validate.js

export const isValidPhone = (phone) =>
  /^0\d{9}$/.test(phone); // VN phone 10 số

export const isValidCCCD = (cccd) =>
  !cccd || /^\d{12}$/.test(cccd); // CCCD 12 số hoặc bỏ trống

export const isValidDob = (dob) => {
  if (!dob) return false;
  const date = new Date(dob);
  const today = new Date();
  return date < today; // không cho ngày sinh tương lai
};

export const validatePatientForm = (form) => {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên";
  }

  if (!form.dob || !isValidDob(form.dob)) {
    errors.dob = "Ngày sinh không hợp lệ";
  }

  if (!form.phone || !isValidPhone(form.phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  if (!isValidCCCD(form.cccd)) {
    errors.cccd = "CCCD phải gồm 12 chữ số";
  }

  if (!form.province) {
    errors.province = "Vui lòng chọn Tỉnh / Thành phố";
  }

  if (!form.commune) {
    errors.commune = "Vui lòng chọn Phường / Xã";
  }

  return errors;
};
