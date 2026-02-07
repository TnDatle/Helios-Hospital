# Base image nhẹ, phổ biến
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json trước để cache npm install
COPY package*.json ./

# Cài dependency (KHÔNG cài devDependencies)
RUN npm install --omit=dev

# Copy toàn bộ source code
COPY . .

# Expose port (đổi nếu server.js dùng port khác)
EXPOSE 5000

# Chạy app
CMD ["npm", "start"]
