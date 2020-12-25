import groq from "groq";

export const loginQuery = groq`
  *[_type == "player" && (nikname == $name && pin == $pin) || (email == $name && pin == $pin)]{
    _id,
    name,
    surname,
    nikname,
    email,
    profileImage,
    'roles': roles[]->role->name
  }[0]`;
