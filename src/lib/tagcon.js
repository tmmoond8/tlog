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
import uberCloneCoding from "../img/tagcon/uber.png";
import projectSetup from "../img/tagcon/project-setup.png";
import apollo from "../img/tagcon/apollo.png";

const TAGCON = {
  gatsby: { image: gatsby, name: "Gatsby.js" },
  react: { image: react, name: "React" },
  "nomad-coders": { image: nomadcoders },
  "우버-클론-코딩": { image: uberCloneCoding },
  "graphql-yoga": { image: graphqlYoga },
  typeorm: { image: typeorm, name: "TypeORM" },
  jwt: { image: jwt, name: "JWT" },
  graphql: { image: graphql, name: "GraphQL" },
  Twilio: { image: twilio },
  Mailgun: { image: mailgun },
  postgresql: { image: postgresql, name: "PostgreSQL" },
  "project-setup": { image: projectSetup },
  nextjs: { image: nextjs, name: "Next.js" },
  ssr: { image: ssr, name: "SSR" },
  apollo: { image: apollo, name: "Apollo" }
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