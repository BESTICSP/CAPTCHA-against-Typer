FROM node:8-alpine
WORKDIR /work
ADD package.json yarn.lock index.js captcha.js /work/
ADD dist /work/dist
ADD fonts /work/fonts
RUN yarn --prod
CMD yarn start
EXPOSE 80
