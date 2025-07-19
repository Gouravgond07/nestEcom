FROM node:alpine as auth-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build auth


# Stage 2: Run
FROM node:alpine
WORKDIR /app
COPY --from=auth-builder /app/dist/apps/auth ./
COPY --from=auth-builder /app/node_modules ./node_modules
CMD ["node", "main.js"]