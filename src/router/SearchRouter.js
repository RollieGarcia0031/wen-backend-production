import express from 'express';
import * as Professor from '../controller/ProfessorController.js'

const SearchRouter = express.Router();

SearchRouter.post('/professor', Professor.searchByInfo);
SearchRouter.post('/availability', Professor.searchAvailabilityById);

export default SearchRouter;