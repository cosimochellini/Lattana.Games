import groq from "groq";

export const loginQuery = groq`
  *[_type == "player" && (nickname == $name && pin == $pin) || (email == $name && pin == $pin)]{
    _id,
    name,
    surname,
    nickname,
    email,
    profileImage,
    'roles': roles[]->role->name
  }[0]`;
