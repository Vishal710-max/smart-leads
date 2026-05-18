"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const auth_1 = require("../types/auth");
const lead_1 = require("../types/lead");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.get('/', leadController_1.getLeads);
router.get('/export', leadController_1.exportLeadsCSV);
router.get('/:id', [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid lead ID')], validateRequest_1.validateRequest, leadController_1.getLeadById);
router.post('/', [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('source')
        .isIn(Object.values(lead_1.LeadSource))
        .withMessage(`Source must be one of: ${Object.values(lead_1.LeadSource).join(', ')}`),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(Object.values(lead_1.LeadStatus))
        .withMessage(`Status must be one of: ${Object.values(lead_1.LeadStatus).join(', ')}`),
], validateRequest_1.validateRequest, leadController_1.createLead);
router.patch('/:id', [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid lead ID'),
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('source')
        .optional()
        .isIn(Object.values(lead_1.LeadSource))
        .withMessage(`Source must be one of: ${Object.values(lead_1.LeadSource).join(', ')}`),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(Object.values(lead_1.LeadStatus))
        .withMessage(`Status must be one of: ${Object.values(lead_1.LeadStatus).join(', ')}`),
], validateRequest_1.validateRequest, leadController_1.updateLead);
router.delete('/:id', [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid lead ID')], validateRequest_1.validateRequest, (0, roleMiddleware_1.requireRole)(auth_1.UserRole.Admin), leadController_1.deleteLead);
exports.default = router;
