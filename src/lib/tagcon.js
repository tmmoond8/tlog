import gatsby from "../img/tagcon/gatsby.png";
import react from "../img/tagcon/react.svg";
import nomadcoders from "../img/tagcon/nomadcoders.jpg";
import typeorm from "../img/tagcon/typeorm.png";
import jwt from "../img/tagcon/jwt.png";
import graphql from "../img/tagcon/graphql.png";
import twilio from "../img/tagcon/twilio.jpg";
import mailgun from "../img/tagcon/mailgun.png";
import postgresql from "../img/tagcon/postgresql.png";
import nextjs from "../img/tagcon/nextjs.png";
import graphqlYoga from "../img/tagcon/graphql-yoga.png";
import ssr from "../img/tagcon/ssr.jpg";
import oauth from "../img/tagcon/oauth.png";
import uberCloneCoding from "../img/tagcon/uber.png";
import projectSetup from "../img/tagcon/project-setup.png";
import apollo from "../img/tagcon/apollo.png";
import styledComponents from "../img/tagcon/styled_components.png";
import googlemap from "../img/tagcon/googlemap.png";
import http from "../img/tagcon/http.png";
import typescript from "../img/tagcon/typescript.png";
import book from "../img/tagcon/book.jpg";
import seminar from "../img/tagcon/seminar.png";
import html from "../img/tagcon/html.png";
import svg from "../img/tagcon/svg.png";
import npm from "../img/tagcon/npm.jpg";
import db from "../img/tagcon/db.png";
import css from "../img/tagcon/css.png";
import babel from "../img/tagcon/babel.png";
import javascript from "../img/tagcon/javascript.png";
import etc from "../img/tagcon/etc.png";

const TAGCON = {
  gatsby: { image: gatsby, name: "Gatsby.js" },
  react: { image: react, name: "React" },
  "nomad-coders": { image: nomadcoders, name: "노마드 코더" },
  "uber-clone-coding": { image: uberCloneCoding, name: "우버 클론 코딩" },
  "graphql-yoga": { image: graphqlYoga },
  typeorm: { image: typeorm, name: "TypeORM" },
  jwt: { image: jwt, name: "JWT" },
  graphql: { image: graphql, name: "GraphQL" },
  Twilio: { image: twilio },
  mailgun: { image: mailgun },
  postgresql: { image: postgresql, name: "PostgreSQL" },
  "project-setup": { image: projectSetup, name: "프로젝트 셋팅" },
  nextjs: { image: nextjs, name: "Next.js" },
  ssr: { image: ssr, name: "SSR" },
  oauth: { image: oauth, name: "OAuth" },
  apollo: { image: apollo, name: "Apollo" },
  "styled-components": { image: styledComponents, name: "styled components"},
  'google-map-api': { image: googlemap, name: "Google Map API" },
  http: { image: http, name: "HTTP" },
  typescript: { image: typescript, name: "TypeScript" },
  book: { image: book, name: "book review" },
  seminar: { image: seminar, name: "seminar" },
  html: { image: html, name: "html" },
  svg: { image: svg, name: "svg" },
  npm: { image: npm, name: "npm" },
  db: { image: db, name: "db" },
  css: { image: css, name: "css" },
  babel: { image: babel, name: "babel" },
  javascript: { image: javascript, name: "javascript" },
  etc: { image: etc, name: "etc" },
}

export const getImage = (tag) => {
  if(TAGCON[tag] && TAGCON[tag].image) {
    return TAGCON[tag].image;
  }
  return "";
}

export const getName = (tag) => {
  if(TAGCON[tag] && TAGCON[tag].name) {
    return TAGCON[tag].name;
  }
  return tag;
}