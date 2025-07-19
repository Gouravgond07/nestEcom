FROM node:alpine as ecomerce-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build nest-ecomerce


# Stage 2: Run
FROM node:alpine
WORKDIR /app
COPY --from=ecomerce-builder /app/dist/apps/nest-ecomerce ./
COPY --from=ecomerce-builder /app/node_modules ./node_modules
CMD ["node", "main.js"]