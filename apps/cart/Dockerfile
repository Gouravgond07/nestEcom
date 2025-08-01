FROM node:alpine as cart-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build cart


# Stage 2: Run
FROM node:alpine
WORKDIR /app
COPY --from=cart-builder /app/dist/apps/cart ./
COPY --from=cart-builder /app/node_modules ./node_modules
CMD ["node", "main.js"]