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

const TAGCON = {
  gatsby: { image: gatsby, name: "Gatsby.js" },
  React: { image: react },
  "nomad-coders": { image: nomadcoders },
  "우버-클론-코딩": { emoji: "🚕" },
  "graphql-yoga": { emoji: "🧘" },
  typeorm: { image: typeorm, name: "TypeORM" },
  jwt: { image: jwt, name: "JWT" },
  graphql: { image: graphql, name: "GraphQL" },
  Twilio: { image: twilio },
  Mailgun: { image: mailgun },
  postgresql: { image: postgresql, name: "PostgreSQL" },
  "project-setup": { emoji: "🧙" },
  nextjs: { image: nextjs, name: "Next.js" },
}

export const getImage = (tag) => {
  if(TAGCON[tag] && TAGCON[tag].image) {
    return TAGCON[tag].image;
  }
  return "";
}

export const getEmoji = (tag) => {
  if(TAGCON[tag] && TAGCON[tag].emoji) {
    return TAGCON[tag].emoji;
  }
  return "";
}

export const getName = (tag) => {
  if(TAGCON[tag] && TAGCON[tag].name) {
    return TAGCON[tag].name;
  }
  return tag;
}