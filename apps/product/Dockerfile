FROM node:alpine as product-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build product


# Stage 2: Run
FROM node:alpine
WORKDIR /app
COPY --from=product-builder /app/dist/apps/product ./
COPY --from=product-builder /app/node_modules ./node_modules
CMD ["node", "main.js"]