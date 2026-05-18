"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeadsCSV = exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeadById = exports.getLeads = void 0;
const json2csv_1 = require("json2csv");
const Lead_1 = require("../models/Lead");
const ApiError_1 = require("../utils/ApiError");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const lead_1 = require("../types/lead");
const LIMIT = 10;
exports.getLeads = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { status, source, search, sort = 'latest', page = '1' } = req.query;
    const filter = {};
    if (status && Object.values(lead_1.LeadStatus).includes(status)) {
        filter.status = status;
    }
    if (source && Object.values(lead_1.LeadSource).includes(source)) {
        filter.source = source;
    }
    if (search && search.trim()) {
        filter.$or = [
            { name: { $regex: search.trim(), $options: 'i' } },
            { email: { $regex: search.trim(), $options: 'i' } },
        ];
    }
    const sortOrder = sort === 'oldest' ? 1 : -1;
    const currentPage = Math.max(1, parseInt(page, 10));
    const skip = (currentPage - 1) * LIMIT;
    const [data, total] = await Promise.all([
        Lead_1.Lead.find(filter)
            .sort({ createdAt: sortOrder })
            .skip(skip)
            .limit(LIMIT)
            .populate('createdBy', 'name email'),
        Lead_1.Lead.countDocuments(filter),
    ]);
    res.json({
        success: true,
        data,
        pagination: {
            total,
            page: currentPage,
            limit: LIMIT,
            totalPages: Math.ceil(total / LIMIT),
        },
    });
});
exports.getLeadById = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const lead = await Lead_1.Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead)
        throw new ApiError_1.ApiError(404, 'Lead not found');
    res.json({ success: true, data: lead });
});
exports.createLead = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { name, email, status, source } = req.body;
    const lead = await Lead_1.Lead.create({
        name,
        email,
        status: status ?? lead_1.LeadStatus.New,
        source,
        createdBy: req.user.id,
    });
    res.status(201).json({ success: true, data: lead });
});
exports.updateLead = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { name, email, status, source } = req.body;
    const lead = await Lead_1.Lead.findByIdAndUpdate(req.params.id, { name, email, status, source }, { new: true, runValidators: true });
    if (!lead)
        throw new ApiError_1.ApiError(404, 'Lead not found');
    res.json({ success: true, data: lead });
});
exports.deleteLead = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const lead = await Lead_1.Lead.findByIdAndDelete(req.params.id);
    if (!lead)
        throw new ApiError_1.ApiError(404, 'Lead not found');
    res.json({ success: true, message: 'Lead deleted successfully' });
});
exports.exportLeadsCSV = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { status, source, search } = req.query;
    const filter = {};
    if (status && Object.values(lead_1.LeadStatus).includes(status))
        filter.status = status;
    if (source && Object.values(lead_1.LeadSource).includes(source))
        filter.source = source;
    if (search && search.trim()) {
        filter.$or = [
            { name: { $regex: search.trim(), $options: 'i' } },
            { email: { $regex: search.trim(), $options: 'i' } },
        ];
    }
    const leads = await Lead_1.Lead.find(filter).sort({ createdAt: -1 }).lean();
    const fields = [
        { label: 'Name', value: 'name' },
        { label: 'Email', value: 'email' },
        { label: 'Status', value: 'status' },
        { label: 'Source', value: 'source' },
        {
            label: 'Created At',
            value: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
    ];
    const parser = new json2csv_1.Parser({ fields });
    const csv = parser.parse(leads);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).end(csv);
});
