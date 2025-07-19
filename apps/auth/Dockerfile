FROM node:alpine as authBuilder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build 


# Stage 2: Run
FROM node:alpine
WORKDIR /app
COPY --from=authBuilder /app/dist/apps/auth ./
COPY --from=authBuilder /app/node_modules ./node_modules
CMD ["node", "main.js"]