import express from 'express';
import { getFleetVehicles, createFleetVehicle, updateFleetVehicle, deleteFleetVehicle } from '../controllers/fleetController.js';

const router = express.Router();

router.get('/', getFleetVehicles);
router.post('/', createFleetVehicle);
router.put('/:id', updateFleetVehicle);
router.delete('/:id', deleteFleetVehicle);

export default router;
