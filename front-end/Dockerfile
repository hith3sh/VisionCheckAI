# Step 1: Build the frontend
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build the app with .env.docker (MODE=docker)
ARG MODE=docker
ENV MODE=$MODE
RUN npm run build -- --mode $MODE

# Step 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]











