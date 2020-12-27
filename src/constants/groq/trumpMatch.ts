import groq from "groq";

export const trumpMatches = groq`
*[_type == 'trumpMatch'] 
{
  matchDate, 
  startingScore, 
  finalScore, 
  callingPlayer -> {name, surname, profileImage}, 
  players[] -> {player -> {name, surname, profileImage}, win}
}
`;
