"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSource = exports.LeadStatus = void 0;
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["New"] = "new";
    LeadStatus["Contacted"] = "contacted";
    LeadStatus["Qualified"] = "qualified";
    LeadStatus["Lost"] = "lost";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var LeadSource;
(function (LeadSource) {
    LeadSource["Website"] = "website";
    LeadSource["Instagram"] = "instagram";
    LeadSource["Referral"] = "referral";
})(LeadSource || (exports.LeadSource = LeadSource = {}));
