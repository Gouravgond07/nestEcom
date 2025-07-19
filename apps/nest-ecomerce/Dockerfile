FROM node:alpine as ecomerceBuilder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build 


# Stage 2: Run
FROM node:alpine
WORKDIR /app
COPY --from=ecomerceBuilder /app/dist/apps/nest-ecomerce ./
COPY --from=ecomerceBuilder /app/node_modules ./node_modules
CMD ["node", "main.js"]