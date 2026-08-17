'use client';

import React, { useState } from 'react';
import { Company } from '../../types';
import { Button, Input, Card, CardHeader } from '../ui';
import { Building2, Save, Plus, X, Globe, Award, CheckCircle2 } from 'lucide-react';

interface CapabilityFormProps {
  company: Company;
  onSave: (updated: Partial<Company>) => Promise<void>;
}

export const CapabilityForm: React.FC<CapabilityFormProps> = ({ company, onSave }) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: company.name || '',
    taxId: company.taxId || '',
    industry: company.industry || '',
    annualRevenue: company.annualRevenue || '',
    teamSize: company.teamSize || 10,
    website: company.website || '',
    description: company.description || '',
    countries: company.countries || [],
    certifications: company.certifications || [],
    services: company.services || [],
  });

  const [newCountry, setNewCountry] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newService, setNewService] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddItem = (
    field: 'countries' | 'certifications' | 'services',
    value: string,
    setter: (v: string) => void,
  ) => {
    if (!value.trim()) return;
    const current = formData[field] || [];
    if (!current.includes(value.trim())) {
      setFormData({ ...formData, [field]: [...current, value.trim()] });
    }
    setter('');
  };

  const handleRemoveItem = (field: 'countries' | 'certifications' | 'services', index: number) => {
    const current = [...(formData[field] || [])];
    current.splice(index, 1);
    setFormData({ ...formData, [field]: current });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card padding="lg">
        <CardHeader
          title="Company Identification & Business Overview"
          description="General company details used by the AI engine to evaluate buyer eligibility"
          icon={<Building2 className="w-5 h-5 text-emerald-600" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Tax Registration / DUNS #"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            placeholder="e.g. US-9948271"
          />
          <Input
            label="Primary Industry Sector"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            required
          />
          <Input
            label="Annual Revenue Range"
            value={formData.annualRevenue}
            onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
            placeholder="e.g. $10M - $25M"
          />
          <Input
            label="Full-time Team Size"
            type="number"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
          />
          <Input
            label="Official Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://company.com"
          />
        </div>
        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
            Company Executive Summary
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-emerald-600 font-medium shadow-sm"
            placeholder="Describe core capabilities, track record, and value proposition..."
          />
        </div>
      </Card>

      {/* Operational Regions */}
      <Card padding="lg">
        <CardHeader
          title="Operational Regions & Geography"
          description="Countries where your company has legal presence or can deliver services"
          icon={<Globe className="w-5 h-5 text-sky-600" />}
        />
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add operating country (e.g. Germany, UK, USA)"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddItem('countries', newCountry, setNewCountry);
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleAddItem('countries', newCountry, setNewCountry)}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.countries?.map((country, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>{country}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem('countries', idx)}
                className="hover:text-rose-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </Card>

      {/* Certifications */}
      <Card padding="lg">
        <CardHeader
          title="Industry Certifications & Accreditations"
          description="Crucial for tender eligibility scoring (e.g. ISO 27001, SOC 2, ISO 9001)"
          icon={<Award className="w-5 h-5 text-amber-600" />}
        />
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add certification (e.g. ISO 27001, SOC 2 Type II)"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddItem('certifications', newCert, setNewCert);
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleAddItem('certifications', newCert, setNewCert)}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.certifications?.map((cert, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>{cert}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem('certifications', idx)}
                className="hover:text-rose-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </Card>

      {/* Services */}
      <Card padding="lg">
        <CardHeader
          title="Core Services & Capability Domains"
          description="Key service offerings matched against tender technical specifications"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add service (e.g. Cloud Migration, Cybersecurity, DevOps)"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddItem('services', newService, setNewService);
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleAddItem('services', newService, setNewService)}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.services?.map((service, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>{service}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem('services', idx)}
                className="hover:text-rose-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {savedSuccess && (
          <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
          </span>
        )}
        <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Capability Profile
        </Button>
      </div>
    </form>
  );
};
