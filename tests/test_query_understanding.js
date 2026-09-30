import { understandQuery } from "../src/services/query_understanding_service.js";

const result = await understandQuery(
  "I am a fresher I want Roles that are open to MERN,SDE in MNC's or I am targeting start ups as well.",
);

console.log(result);
