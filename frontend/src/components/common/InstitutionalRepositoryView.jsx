import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Search,
  BookOpen,
  Calendar,
  Building2,
  Shield,
  Layers,
  Sparkles,
  ArrowDownToLine,
  CheckCircle2,
  Printer,
  X,
  ExternalLink,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import {
  loadAllRepositoryCategories,
  loadAllRepositoryCategoryList,
  saveRepositoryDocument,
  deleteRepositoryDocument,
  CATEGORY_LIST
} from '../../lib/documentRepositoryData';
import { useToast } from '../../context/ToastContext';
import { printOfficialDocument, downloadOfficialDocument } from '../../lib/exportFormatHelper';

export default function InstitutionalRepositoryView({ initialCategoryId = 'syllabus', role = 'student' }) {
  const toast = useToast?.() || {};
  const [categories, setCategories] = useState(loadAllRepositoryCategoryList);
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [previewDocId, setPreviewDocId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Admin Document Modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [docForm, setDocForm] = useState({
    categoryId: initialCategoryId,
    code: '',
    title: '',
    format: 'PDF',
    size: '1.8 MB',
    author: 'Department of IT / Academic Council',
    scheme: 'Autonomous Scheme 2026',
    summary: '',
    content: ''
  });

  // Sync categories on storage updates
  useEffect(() => {
    const handleRepoUpdated = (e) => {
      if (e.detail && e.detail.categories) {
        const catData = e.detail.categories;
        setCategories(Array.isArray(catData) ? catData : Object.values(catData));
      } else {
        setCategories(loadAllRepositoryCategoryList());
      }
    };
    window.addEventListener('edutrack_repository_updated', handleRepoUpdated);
    return () => {
      window.removeEventListener('edutrack_repository_updated', handleRepoUpdated);
    };
  }, []);

  const categoryList = Array.isArray(categories)
    ? categories
    : categories && typeof categories === 'object'
    ? Object.values(categories)
    : CATEGORY_LIST;

  const currentCategory = categoryList.find((c) => c?.id === activeCategoryId) || categoryList[0] || CATEGORY_LIST[0];
  const categoryDocs = currentCategory?.documents || [];

  // Filter documents in current category
  const filteredDocs = categoryDocs.filter((doc) => {
    if (selectedFormat !== 'All' && doc.format !== selectedFormat) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchCode = doc.code.toLowerCase().includes(q);
      const matchSummary = doc.summary.toLowerCase().includes(q);
      return matchTitle || matchCode || matchSummary;
    }
    return true;
  });

  const activePreviewDoc =
    categoryDocs.find((d) => d.id === previewDocId) ||
    filteredDocs[0] ||
    categoryDocs[0];

  const handleOpenAddDoc = (catId = activeCategoryId) => {
    setEditingDoc(null);
    setDocForm({
      categoryId: catId,
      code: `${catId.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      format: 'PDF',
      size: '1.5 MB',
      author: 'Department of Information Technology',
      scheme: 'Autonomous Scheme 2026',
      summary: '',
      content: `INSTITUTIONAL DOCUMENT RECORD
TITLE: New Document
EFFECTIVE DATE: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
SCHEME: Autonomous Scheme 2026

1. SCOPE & OBJECTIVE:
- Detailed academic record guidelines and institutional instructions.
- Approved by Autonomous Academic Governance Board.`
    });
    setIsDocModalOpen(true);
  };

  const handleOpenEditDoc = (doc, catId = activeCategoryId) => {
    setEditingDoc(doc);
    setDocForm({
      categoryId: catId,
      code: doc.code || '',
      title: doc.title || '',
      format: doc.format || 'PDF',
      size: doc.size || '1.8 MB',
      author: doc.author || 'Academic Council',
      scheme: doc.scheme || 'Autonomous Scheme 2026',
      summary: doc.summary || '',
      content: doc.content || ''
    });
    setIsDocModalOpen(true);
  };

  const handleDeleteDoc = (doc, catId = activeCategoryId) => {
    if (window.confirm(`Are you sure you want to permanently delete repository document "${doc.title}"?`)) {
      deleteRepositoryDocument(catId, doc.id);
      if (previewDocId === doc.id) {
        setPreviewDocId(null);
      }
      if (toast?.info) {
        toast.info('Document Removed', `Deleted document ${doc.code}: ${doc.title}.`);
      }
    }
  };

  const handleSaveDoc = (e) => {
    e.preventDefault();
    if (!docForm.code.trim() || !docForm.title.trim()) {
      if (toast?.error) toast.error('Validation Error', 'Document code and title are required.');
      return;
    }

    saveRepositoryDocument(docForm.categoryId, {
      id: editingDoc?.id,
      code: docForm.code.trim(),
      title: docForm.title.trim(),
      format: docForm.format,
      size: docForm.size || '1.5 MB',
      author: docForm.author || 'Academic Governance Board',
      scheme: docForm.scheme || 'Autonomous Scheme 2026',
      summary: docForm.summary.trim(),
      content: docForm.content.trim(),
      date: editingDoc?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    if (toast?.success) {
      toast.success(
        editingDoc ? 'Document Updated' : 'Document Published',
        `Successfully saved ${docForm.code}: ${docForm.title}.`
      );
    }

    setIsDocModalOpen(false);
  };

  const handleDownload = (doc) => {
    downloadOfficialDocument(doc);
    if (toast?.success) {
      toast.success(
        'Official File Downloaded',
        `Saved formatted document: ${doc.code} (${doc.title.slice(0, 32)}...)`
      );
    }
  };

  const handlePrint = (doc) => {
    printOfficialDocument(doc);
    if (toast?.info) {
      toast.info('Opening Print View', `Preparing official A4 document for ${doc.code}.`);
    }
  };

  const handleCopyCitation = (doc) => {
    const citation = `EduTrack Institutional Repository (${doc.code}): "${doc.title}", Published by ${doc.author}, Updated ${doc.date}. Official Verification: Active.`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedId(doc.id);
      setTimeout(() => setCopiedId(null), 2000);
      if (toast?.info) {
        toast.info('Citation Copied', 'Official document reference copied to clipboard.');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      {/* 1. Header Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              flexShrink: 0
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Institutional Resource & Document Repository
              </h2>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0'
                }}
              >
                Verified Autonomous Records · Scheme 2026
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Official curriculum syllabi, previous years' solved question papers, laboratory journals, bonafide templates, and academic policies.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {(role === 'admin' || role === 'teacher') && (
            <button
              type="button"
              onClick={() => handleOpenAddDoc(activeCategoryId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.16s ease'
              }}
            >
              <Plus size={15} />
              <span>Upload Document</span>
            </button>
          )}

          {activePreviewDoc && (
            <>
              <button
                type="button"
                onClick={() => handlePrint(activePreviewDoc)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.16s ease'
                }}
                title="Print document formatted on standard A4 sheet"
              >
                <Printer size={15} />
                <span>Print Document</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload(activePreviewDoc)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                  transition: 'all 0.16s ease'
                }}
              >
                <Download size={15} />
                <span>Download Official File</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Category Pills Switcher Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          overflowX: 'auto',
          boxSizing: 'border-box'
        }}
      >
        {categoryList.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategoryId(cat.id);
                setPreviewDocId(null);
              }}
              style={{
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#065f46' : '#475569',
                background: isActive ? '#ecfdf5' : '#f8fafc',
                border: isActive ? '1.5px solid #059669' : '1px solid #e2e8f0',
                boxShadow: isActive ? '0 2px 8px rgba(5, 150, 105, 0.15)' : 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease'
              }}
            >
              <span>{cat.title}</span>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  background: isActive ? '#059669' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b',
                  padding: '2px 7px',
                  borderRadius: '999px'
                }}
              >
                {cat.documents.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Workspace: Split Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '18px',
          alignItems: 'start',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {/* LEFT COLUMN: Catalog list */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          {/* Search & Format Bar */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 12px'
              }}
            >
              <Search size={15} style={{ color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by code, title, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.825rem',
                  color: '#0f172a',
                  width: '100%'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Format Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {['All', 'PDF', 'DOCX', 'PPTX'].map((fmt) => {
                const isFmtActive = selectedFormat === fmt;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.725rem',
                      fontWeight: isFmtActive ? 700 : 500,
                      color: isFmtActive ? '#ffffff' : '#64748b',
                      background: isFmtActive ? '#0f172a' : '#f1f5f9',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {fmt}
                  </button>
                );
              })}
              <span style={{ marginLeft: 'auto', fontSize: '0.725rem', color: '#94a3b8', fontWeight: 600 }}>
                {filteredDocs.length} items
              </span>
            </div>
          </div>

          {/* Document list */}
          <div
            style={{
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '620px',
              overflowY: 'auto'
            }}
          >
            {filteredDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
                <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>No documents found</p>
                <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0' }}>Try a different keyword</p>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = activePreviewDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setPreviewDocId(doc.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      border: isSelected ? '1.5px solid #059669' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.16s ease',
                      boxShadow: isSelected ? '0 3px 10px rgba(5, 150, 105, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.675rem',
                          fontWeight: 700,
                          color: isSelected ? '#065f46' : '#2563eb',
                          background: isSelected ? '#d1fae5' : '#eff6ff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: isSelected ? '1px solid #a7f3d0' : '1px solid #bfdbfe'
                        }}
                      >
                        {doc.code}
                      </span>
                      <span style={{ fontSize: '0.675rem', fontWeight: 600, color: '#ef4444' }}>
                        {doc.format} · {doc.size}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                      {doc.title}
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.74rem',
                        color: '#64748b',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {doc.summary}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>
                      <span>{doc.date}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#059669', fontWeight: 600 }}>Active · {doc.scheme || 'Scheme 2026'}</span>
                        {(role === 'admin' || role === 'teacher') && (
                          <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditDoc(doc, activeCategoryId)}
                              style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', borderRadius: '4px', padding: '2px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              title="Edit Document"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(doc, activeCategoryId)}
                              style={{ border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', borderRadius: '4px', padding: '2px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              title="Delete Document"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Document Reading Desk */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box',
            minWidth: 0,
            overflowX: 'hidden'
          }}
        >
          {activePreviewDoc ? (
            <>
              {/* Document Sub-Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    OFFICIAL RECORD PREVIEW · {activePreviewDoc.code}
                  </span>
                  <h3 style={{ margin: '3px 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {activePreviewDoc.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {role === 'admin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEditDoc(activePreviewDoc, activeCategoryId)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#1e293b',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Edit Doc</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteDoc(activePreviewDoc, activeCategoryId)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCopyCitation(activePreviewDoc)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === activePreviewDoc.id ? <Check size={14} style={{ color: '#059669' }} /> : <Copy size={14} />}
                    <span>{copiedId === activePreviewDoc.id ? 'Copied' : 'Copy Citation'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrint(activePreviewDoc)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Printer size={14} />
                    <span>Print Sheet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(activePreviewDoc)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    <Download size={14} />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              {/* The Paper Sheet: Clean Responsive Container */}
              <div
                style={{
                  background: '#fcfdfd',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '28px 32px',
                  boxSizing: 'border-box',
                  width: '100%',
                  maxWidth: '100%',
                  overflowX: 'hidden'
                }}
              >
                {/* University Header */}
                <div
                  style={{
                    borderBottom: '2px solid #059669',
                    paddingBottom: '14px',
                    marginBottom: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase' }}>
                      EduTrack Institute of Technology (Autonomous)
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Affiliated to State Technological University · Approved by AICTE & UGC
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#475569' }}>
                    <div>CODE: <strong style={{ color: '#0f172a' }}>{activePreviewDoc.code}</strong></div>
                    <div>STATUS: <strong style={{ color: '#059669' }}>ACTIVE RECORD</strong></div>
                  </div>
                </div>

                {/* Metadata strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    background: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '18px',
                    fontSize: '0.74rem'
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Publishing Body
                    </span>
                    <strong style={{ color: '#0f172a' }}>{activePreviewDoc.author}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Effective Date
                    </span>
                    <strong style={{ color: '#0f172a' }}>{activePreviewDoc.date}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Institutional Framework
                    </span>
                    <strong style={{ color: '#059669' }}>{activePreviewDoc.scheme || 'Autonomous Scheme 2026'}</strong>
                  </div>
                </div>

                {/* Document Body (Responsive, Text-Wrap, No horizontal overflow) */}
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                    fontSize: '0.8rem',
                    lineHeight: '1.6',
                    color: '#1e293b',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    margin: 0,
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {activePreviewDoc.content}
                </pre>

                {/* Digital Verification Footer */}
                <div
                  style={{
                    marginTop: '24px',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.725rem',
                    color: '#64748b',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} style={{ color: '#059669' }} />
                    <span>Digitally Authenticated by EduTrack Academic Governance Board</span>
                  </div>
                  <div>
                    Ref: <code>EDUTRACK-DOC-{activePreviewDoc.code}</code>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <BookOpen size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b' }}>Select a document to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin: Upload / Edit Repository Document Modal */}
      {isDocModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsDocModalOpen(false)} style={{ zIndex: 130 }}>
          <div
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '640px',
              width: '92vw',
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)'
            }}
          >
            <div className="modal-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="#059669" />
                <h3 className="modal-heading-title">
                  {editingDoc ? 'Edit Repository Document' : 'Upload Institutional Resource / Document'}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsDocModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="modal-form-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Target Repository Category *</label>
                  <select
                    value={docForm.categoryId}
                    onChange={(e) => setDocForm({ ...docForm, categoryId: e.target.value })}
                    className="form-input-control"
                  >
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-field">
                  <label className="form-field-label">File Format *</label>
                  <select
                    value={docForm.format}
                    onChange={(e) => setDocForm({ ...docForm, format: e.target.value })}
                    className="form-input-control"
                  >
                    <option value="PDF">PDF (Portable Document)</option>
                    <option value="DOCX">DOCX (Word Document)</option>
                    <option value="PPTX">PPTX (Presentation)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Document Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. IT-601-SYL"
                    value={docForm.code}
                    onChange={(e) => setDocForm({ ...docForm, code: e.target.value })}
                    className="form-input-control"
                    required
                  />
                </div>

                <div className="form-group-field">
                  <label className="form-field-label">Document Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Systems Autonomous Syllabus 2026"
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    className="form-input-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div className="form-group-field">
                  <label className="form-field-label">Publishing Authority / Author</label>
                  <input
                    type="text"
                    placeholder="e.g. Department of Information Technology"
                    value={docForm.author}
                    onChange={(e) => setDocForm({ ...docForm, author: e.target.value })}
                    className="form-input-control"
                  />
                </div>

                <div className="form-group-field">
                  <label className="form-field-label">Academic Scheme</label>
                  <input
                    type="text"
                    placeholder="e.g. Autonomous Scheme 2026"
                    value={docForm.scheme}
                    onChange={(e) => setDocForm({ ...docForm, scheme: e.target.value })}
                    className="form-input-control"
                  />
                </div>
              </div>

              <div className="form-group-field">
                <label className="form-field-label">Executive Summary / Abstract *</label>
                <textarea
                  rows={2}
                  placeholder="Concise 1-2 sentence description of curriculum or policy contents..."
                  value={docForm.summary}
                  onChange={(e) => setDocForm({ ...docForm, summary: e.target.value })}
                  className="form-input-control"
                  required
                />
              </div>

              <div className="form-group-field">
                <label className="form-field-label">Official Document Body / Content *</label>
                <textarea
                  rows={8}
                  placeholder="Paste or write the official syllabus units, questions, policies, or bonafide text..."
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                  className="form-input-control"
                  style={{ fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.5 }}
                  required
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsDocModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', border: 'none' }}
                >
                  <Plus size={14} />
                  <span>{editingDoc ? 'Update Document' : 'Publish Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
