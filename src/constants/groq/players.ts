import groq from "groq";

export const playersAutocomplete = groq`
*[_type == 'player' && (name match $search || surname match $search) && !(_id in $excluded)] 
{nikname,'roles': roles[]->role->name, profileImage, ...}
`;
