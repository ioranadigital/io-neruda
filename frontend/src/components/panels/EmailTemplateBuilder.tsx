'use client';

import React, { useState } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { useEmailTemplates } from '../../hooks/useEmailTemplates';
import { EmailTemplate } from '../../types/generator';

export default function EmailTemplateBuilder() {
  const { setLoading, setError } = useGenerator();
  const { getTemplates, templates, isLoading } = useEmailTemplates();

  const [activeTab, setActiveTab] = useState<'system' | 'project' | 'create'>('system');
  const [formData, setFormData] = useState({
    name: '',
    category: 'general',
    template_body: '',
    is_system: false,
  });

  const [templatePreview, setTemplatePreview] = useState<string>('');
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});

  const TEMPLATE_VARIABLES = ['subject', 'greeting', 'body_intro', 'body_main', 'cta_text', 'cta_url', 'signature'];

  const handleAddVariable = (variable: string) => {
    if (!formData.template_body.includes(`{{${variable}}}`)) {
      setFormData({
        ...formData,
        template_body: formData.template_body + ` {{${variable}}}`,
      });
    }
  };

  const generatePreview = (template: EmailTemplate | typeof formData) => {
    let preview = template.template_body || '';

    // Replace variables with sample values
    TEMPLATE_VARIABLES.forEach(variable => {
      const value = templateVars[variable] || `[${variable}]`;
      preview = preview.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });

    setTemplatePreview(preview);
  };

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.template_body) {
      setError('Name and template body are required');
      return;
    }

    setLoading(true);
    try {
      const newTemplate = {
        name: formData.name,
        category: formData.category,
        template_body: formData.template_body,
        is_system: formData.is_system,
      };

      // Here you would call the API to save
      // await createTemplate(newTemplate);

      setError(null);
      setFormData({
        name: '',
        category: 'general',
        template_body: '',
        is_system: false,
      });
      setActiveTab('project');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Email Templates</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'system'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-2'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            System Templates ({templates.system?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'project'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-2'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Project Templates ({templates.project?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-2'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Create New
          </button>
        </div>

        {/* System Templates */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Loading templates...</p>
            ) : templates.system && templates.system.length > 0 ? (
              templates.system.map(template => (
                <div key={template.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{template.template_body}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {template.category}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No system templates found</p>
            )}
          </div>
        )}

        {/* Project Templates */}
        {activeTab === 'project' && (
          <div className="space-y-4">
            {templates.project && templates.project.length > 0 ? (
              templates.project.map(template => (
                <div key={template.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{template.template_body}</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {template.category}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No project templates yet. Create one below!</p>
            )}
          </div>
        )}

        {/* Create New Template */}
        {activeTab === 'create' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Custom Welcome Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="welcome">Welcome</option>
                <option value="promotional">Promotional</option>
                <option value="newsletter">Newsletter</option>
                <option value="transactional">Transactional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Body</label>
              <textarea
                value={formData.template_body}
                onChange={(e) => setFormData({ ...formData, template_body: e.target.value })}
                placeholder="Write your email template here. Use {{variable}} for dynamic content."
                className="w-full h-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            {/* Variables Helper */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Insert Variables:</p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_VARIABLES.map(variable => (
                  <button
                    key={variable}
                    onClick={() => handleAddVariable(variable)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200"
                  >
                    {`{{${variable}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable Values for Preview */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview Variable Values:</p>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATE_VARIABLES.map(variable => (
                  <input
                    key={variable}
                    type="text"
                    value={templateVars[variable] || ''}
                    onChange={(e) =>
                      setTemplateVars({ ...templateVars, [variable]: e.target.value })
                    }
                    placeholder={`${variable}...`}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                ))}
              </div>
              <button
                onClick={() => generatePreview(formData)}
                className="mt-2 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Generate Preview
              </button>
            </div>

            {/* Preview */}
            {templatePreview && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Preview:</p>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{templatePreview}</div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveTemplate}
              disabled={isLoading || !formData.name || !formData.template_body}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
