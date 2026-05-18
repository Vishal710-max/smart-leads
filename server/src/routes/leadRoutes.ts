import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController';
import { protect } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { UserRole } from '../types/auth';
import { LeadStatus, LeadSource } from '../types/lead';

const router = Router();

router.use(protect);

router.get('/', getLeads);

router.get('/export', exportLeadsCSV);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid lead ID')],
  validateRequest,
  getLeadById
);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('source')
      .isIn(Object.values(LeadSource))
      .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
    body('status')
      .optional()
      .isIn(Object.values(LeadStatus))
      .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  ],
  validateRequest,
  createLead
);

router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid lead ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('source')
      .optional()
      .isIn(Object.values(LeadSource))
      .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
    body('status')
      .optional()
      .isIn(Object.values(LeadStatus))
      .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  ],
  validateRequest,
  updateLead
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid lead ID')],
  validateRequest,
  requireRole(UserRole.Admin),
  deleteLead
);

export default router;
