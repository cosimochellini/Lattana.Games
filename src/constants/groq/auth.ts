/* groq */
// groq
const loginQuery = `
  *[_type == "player" && (nikname == $name && pin == $pin) || (email == $name && pin == $pin)]{
    _id,
    name,
    surname,
    nikname,
    email,
    'roles': roles[]->role->name
  }[0]`;

export { loginQuery };
