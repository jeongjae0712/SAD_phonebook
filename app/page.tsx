'use client';

import { useState, useEffect, useCallback } from 'react';
import ContactTable from '@/components/ContactTable';
import ContactForm from '@/components/ContactForm';
import Modal from '@/components/Modal';
import SearchBar from '@/components/SearchBar';
import { Contact, ContactFormData } from '@/types/contact';

type ModalState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; contact: Contact }
  | { type: 'delete'; contact: Contact };

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchContacts = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const url = q ? `/api/contacts?q=${encodeURIComponent(q)}` : '/api/contacts';
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setContacts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchContacts]);

  const handleAdd = async (data: ContactFormData) => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    setModal({ type: 'closed' });
    fetchContacts(searchQuery);
  };

  const handleEdit = async (data: ContactFormData) => {
    if (modal.type !== 'edit') return;
    const res = await fetch(`/api/contacts/${modal.contact.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    setModal({ type: 'closed' });
    fetchContacts(searchQuery);
  };

  const handleDelete = async () => {
    if (modal.type !== 'delete') return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/contacts/${modal.contact.id}`, { method: 'DELETE' });
      if (!res.ok) return;
      setModal({ type: 'closed' });
      fetchContacts(searchQuery);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">전화번호부</h1>
            <p className="text-xs text-gray-400 mt-0.5">SAD Phonebook</p>
          </div>
          <button
            onClick={() => setModal({ type: 'add' })}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">새 연락처</span>
            <span className="sm:hidden">추가</span>
          </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              불러오는 중...
            </div>
          ) : (
            <ContactTable
              contacts={contacts}
              onEdit={(contact) => setModal({ type: 'edit', contact })}
              onDelete={(contact) => setModal({ type: 'delete', contact })}
            />
          )}
        </div>

        {!loading && (
          <p className="text-xs text-gray-400 text-right">
            총 {contacts.length}명
          </p>
        )}
      </main>

      {/* 추가 모달 */}
      <Modal
        isOpen={modal.type === 'add'}
        onClose={() => setModal({ type: 'closed' })}
        title="새 연락처 추가"
      >
        <ContactForm
          onSubmit={handleAdd}
          onCancel={() => setModal({ type: 'closed' })}
          submitLabel="추가"
        />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={modal.type === 'edit'}
        onClose={() => setModal({ type: 'closed' })}
        title="연락처 수정"
      >
        {modal.type === 'edit' && (
          <ContactForm
            initialData={{
              name: modal.contact.name,
              phone: modal.contact.phone,
              email: modal.contact.email ?? '',
              memo: modal.contact.memo ?? '',
            }}
            onSubmit={handleEdit}
            onCancel={() => setModal({ type: 'closed' })}
            submitLabel="저장"
          />
        )}
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={modal.type === 'delete'}
        onClose={() => setModal({ type: 'closed' })}
        title="연락처 삭제"
      >
        {modal.type === 'delete' && (
          <div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold text-gray-900">{modal.contact.name}</span>
              {' '}({modal.contact.phone})
            </p>
            <p className="text-sm text-gray-500 mb-6">
              정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 text-white rounded-md py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteLoading ? '삭제 중...' : '삭제'}
              </button>
              <button
                onClick={() => setModal({ type: 'closed' })}
                disabled={deleteLoading}
                className="flex-1 bg-gray-100 text-gray-700 rounded-md py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
