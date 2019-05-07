import gatsby from "../img/tagcon/gatsby.png";
import react from "../img/tagcon/react.svg";

const TAGCON = {
  gatsby: { image: gatsby },
  react: { image: react },
  jamaica: { emoji: "🇯🇲" }
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