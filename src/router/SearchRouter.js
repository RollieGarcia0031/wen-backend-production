import express from 'express';
import * as Proffesor from '../controller/ProfessorController.js'

const SearchRouter = express.Router();

SearchRouter.post('/professor', Proffesor.searchByInfo);
SearchRouter.post('/availability', Proffesor.searchAvailabilityById);

export default SearchRouter;