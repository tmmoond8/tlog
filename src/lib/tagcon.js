import gatsby from "../img/tagcon/gatsby.png";
import react from "../img/tagcon/react.svg";
import nomadcoders from "../img/tagcon/nomadcoders.jpg";
import typeorm from "../img/tagcon/typeorm.png";
import JWT from "../img/tagcon/JWT.png";
import graphql from "../img/tagcon/graphql.png";
import twilio from "../img/tagcon/twilio.jpg";
import mailgun from "../img/tagcon/mailgun.png";
import postgresql from "../img/tagcon/postgresql.png";
import nextjs from "../img/tagcon/nextjs.png";

const TAGCON = {
  "Gatsby.js": { image: gatsby },
  React: { image: react },
  "nomad-coders": { image: nomadcoders },
  "우버-클론-코딩": { emoji: "🚕" },
  "graphql-yoga": { emoji: "🧘" },
  TypeORM: { image: typeorm },
  JWT: { image: JWT },
  GraphQL: { image: graphql },
  Twilio: { image: twilio },
  Mailgun: { image: mailgun },
  PostgreSQL: { image: postgresql },
  "project-setup": { emoji: "🧙" },
  "Next.js": { image: nextjs },
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