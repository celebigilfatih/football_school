'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Group, groupService } from '@/services/group.service';

export default function AdminGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      const data = await groupService.getAll();
      setGroups(data);
      setError(null);
    } catch (err) {
      setError('Gruplar yüklenirken bir hata oluştu');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu grubu silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleteId(id);
    try {
      await groupService.delete(id);
      await fetchGroups();
    } catch (err) {
      setError('Grup silinirken bir hata oluştu');
      console.error('Error deleting group:', err);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alt Yapı Takımlarımız</h1>
        <Link
          href="/admin/groups/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Yeni Takım Ekle
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Takım Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Eğitmen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => (
              <tr key={group._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{group.name}</div>
                  <div className="text-sm text-gray-500">{group.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{group.trainer.name}</div>
                  <div className="text-sm text-gray-500">{group.trainer.qualification}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    group.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {group.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/groups/${group._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(group._id)}
                    disabled={deleteId === group._id}
                    className={`text-red-600 hover:text-red-900 ${
                      deleteId === group._id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {deleteId === group._id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 