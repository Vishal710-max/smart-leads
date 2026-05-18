import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Parser } from 'json2csv';
import { Lead, ILeadDocument } from '../models/Lead';
import { ApiError } from '../utils/ApiError';
import { asyncWrapper } from '../utils/asyncWrapper';
import { LeadStatus, LeadSource, LeadQuery } from '../types/lead';

const LIMIT = 10;

export const getLeads = asyncWrapper(async (req: Request, res: Response) => {
  const { status, source, search, sort = 'latest', page = '1' } = req.query as LeadQuery;

  const filter: FilterQuery<ILeadDocument> = {};

  if (status && Object.values(LeadStatus).includes(status)) {
    filter.status = status;
  }

  if (source && Object.values(LeadSource).includes(source)) {
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
    Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(LIMIT)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(filter),
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

export const getLeadById = asyncWrapper(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.json({ success: true, data: lead });
});

export const createLead = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, status, source } = req.body;

  const lead = await Lead.create({
    name,
    email,
    status: status ?? LeadStatus.New,
    source,
    createdBy: req.user!.id,
  });

  res.status(201).json({ success: true, data: lead });
});

export const updateLead = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, status, source } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { name, email, status, source },
    { new: true, runValidators: true }
  );

  if (!lead) throw new ApiError(404, 'Lead not found');

  res.json({ success: true, data: lead });
});

export const deleteLead = asyncWrapper(async (req: Request, res: Response) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new ApiError(404, 'Lead not found');
  res.json({ success: true, message: 'Lead deleted successfully' });
});

export const exportLeadsCSV = asyncWrapper(async (req: Request, res: Response) => {
  const { status, source, search } = req.query as LeadQuery;

  const filter: FilterQuery<ILeadDocument> = {};

  if (status && Object.values(LeadStatus).includes(status)) filter.status = status;
  if (source && Object.values(LeadSource).includes(source)) filter.source = source;
  if (search && search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

  const fields = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'status' },
    { label: 'Source', value: 'source' },
    {
      label: 'Created At',
      value: (row: Record<string, unknown>) => new Date(row.createdAt as string).toLocaleDateString(),
    },
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.status(200).end(csv);
});
