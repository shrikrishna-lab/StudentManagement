import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Check,
  Search,
  ExternalLink,
  BookOpen,
  Calendar,
  Building2,
  Shield,
  Layers,
  Sparkles,
  ArrowDownToLine,
  CheckCircle2,
  Printer,
  ArrowLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { REPOSITORY_CATEGORIES, CATEGORY_LIST, getCategoryById } from '../../lib/documentRepositoryData';
import { useToast } from '../../context/ToastContext';
import { printOfficialDocument, downloadOfficialDocument } from '../../lib/exportFormatHelper';

export default function DocumentRepositoryModal({
  isOpen,
  onClose,
  initialCategoryId = 'syllabus'
}) {
  const toast = useToast?.() || {};
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [previewDocId, setPreviewDocId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const currentCategory = getCategoryById(activeCategoryId) || CATEGORY_LIST[0];

  // Filter documents in current category
  const filteredDocs = currentCategory.documents.filter((doc) => {
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
    currentCategory.documents.find((d) => d.id === previewDocId) ||
    filteredDocs[0] ||
    currentCategory.documents[0];

  const handleDownload = (doc) => {
    downloadOfficialDocument(doc);
    if (toast?.success) {
      toast.success(
        'Document Downloaded',
        `Downloaded official file: ${doc.code} (${doc.title.slice(0, 32)}...)`
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
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP COMMAND BAR (Edge to Edge Fullscreen Header) */}
      <header
        style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            title="Exit full-screen repository and return to portal"
          >
            <ArrowLeft size={15} />
            <span>Back to Portal</span>
          </button>

          <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                  Institutional Resource & Document Repository
                </h1>
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
                  Verified EduTrack Records
                </span>
              </div>
              <p style={{ margin: '1px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                Official standard operating procedures, policies, syllabi, and academic knowledge assets
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Icons in Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activePreviewDoc && (
            <>
              <button
                type="button"
                onClick={() => handlePrint(activePreviewDoc)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.16s ease'
                }}
                title="Print formatted document on A4 standard sheet"
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
                  padding: '7px 16px',
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
                title="Download official formatted file"
              >
                <Download size={15} />
                <span>Download Official File</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
            aria-label="Close Repository"
          >
            <X size={17} />
          </button>
        </div>
      </header>

      {/* 2. CATEGORY PILLS BAR (Full Width, Sleek Tabs) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 24px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          overflowX: 'auto',
          flexShrink: 0
        }}
      >
        {CATEGORY_LIST.map((cat) => {
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
                background: isActive ? '#ecfdf5' : '#ffffff',
                border: isActive ? '1.5px solid #059669' : '1px solid #e2e8f0',
                boxShadow: isActive ? '0 2px 8px rgba(5, 150, 105, 0.15)' : '0 1px 2px rgba(15, 23, 42, 0.03)',
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

      {/* 3. MAIN WORKSPACE: 2 COLUMNS (Catalog List + Live Document Reading Desk) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {/* LEFT COLUMN: Search & Filtered Document List */}
        <div
          style={{
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff',
            overflow: 'hidden'
          }}
        >
          {/* Search & Format Bar */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                placeholder="Search by title, code, or keyword..."
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
                      fontSize: '0.75rem',
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
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                {filteredDocs.length} items
              </span>
            </div>
          </div>

          {/* Scrollable Document Cards List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {filteredDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>No documents found</p>
                <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0' }}>Try adjusting your keyword or filter</p>
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
                      boxShadow: isSelected ? '0 3px 10px rgba(5, 150, 105, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
                      position: 'relative'
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

                    <h4
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.3
                      }}
                    >
                      {doc.title}
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.75rem',
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
                      <span style={{ color: '#059669', fontWeight: 600 }}>Active · {doc.scheme || 'Scheme 2026'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Expansive Document Reading Desk */}
        <div
          style={{
            flex: 1,
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}
        >
          {activePreviewDoc ? (
            <div style={{ padding: '24px 32px', maxWidth: '920px', margin: '0 auto', width: '100%' }}>
              {/* Document Actions Bar on Top of Desk */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    OFFICIAL DOCUMENT PREVIEW · {activePreviewDoc.code}
                  </span>
                  <h2 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {activePreviewDoc.title}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    title="Copy official academic citation"
                  >
                    {copiedId === activePreviewDoc.id ? <Check size={14} style={{ color: '#059669' }} /> : <Copy size={14} />}
                    <span>{copiedId === activePreviewDoc.id ? 'Copied!' : 'Copy Citation'}</span>
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

              {/* The Paper Sheet (Clean A4 Document Styling) */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  padding: '36px 40px',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflowX: 'hidden'
                }}
              >
                {/* Institutional Document Header */}
                <div
                  style={{
                    borderBottom: '2px solid #059669',
                    paddingBottom: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase' }}>
                      EduTrack Institute of Technology (Autonomous)
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.775rem', color: '#64748b' }}>
                      Affiliated to State Technological University · Approved by AICTE & UGC
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#475569', minWidth: '140px' }}>
                    <div>CODE: <strong style={{ color: '#0f172a' }}>{activePreviewDoc.code}</strong></div>
                    <div>STATUS: <strong style={{ color: '#059669' }}>ACTIVE RECORD</strong></div>
                  </div>
                </div>

                {/* Meta details strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '24px',
                    fontSize: '0.75rem'
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Publishing Body
                    </span>
                    <strong style={{ color: '#0f172a' }}>{activePreviewDoc.author}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Effective Date
                    </span>
                    <strong style={{ color: '#0f172a' }}>{activePreviewDoc.date}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
                      Institutional Framework
                    </span>
                    <strong style={{ color: '#059669' }}>{activePreviewDoc.scheme || 'Autonomous Scheme 2026'}</strong>
                  </div>
                </div>

                {/* Document Body */}
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                    fontSize: '0.8rem',
                    lineHeight: '1.6',
                    color: '#1e293b',
                    background: '#fcfdfd',
                    border: '1px solid #f1f5f9',
                    padding: '24px',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    margin: 0,
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {activePreviewDoc.content}
                </pre>

                {/* Institutional Verification Footer */}
                <div
                  style={{
                    marginTop: '36px',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#64748b'
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
            </div>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8' }}>
              <BookOpen size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#64748b' }}>Select a document to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
