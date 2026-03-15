import express from 'express';
import { getFleetVehicles, createFleetVehicle, deleteFleetVehicle } from '../controllers/fleetController.js';

const router = express.Router();

router.get('/', getFleetVehicles);
router.post('/', createFleetVehicle);
router.delete('/:id', deleteFleetVehicle);

export default router;
