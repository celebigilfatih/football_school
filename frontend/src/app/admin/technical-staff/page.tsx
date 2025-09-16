'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TechnicalStaff } from '@/services/technicalStaff.service';
import { getAllStaff, deleteStaff } from '@/services/technicalStaff.service';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AdminTechnicalStaffPage() {
  const [staff, setStaff] = useState<TechnicalStaff[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const data = await getAllStaff();
      setStaff(data);
    } catch (error) {
      toast.error('Teknik kadro yüklenirken bir hata oluştu');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/technical-staff/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu teknik kadro üyesini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteStaff(id);
        toast.success('Teknik kadro üyesi başarıyla silindi');
        fetchStaff();
      } catch (error) {
        toast.error('Teknik kadro üyesi silinirken bir hata oluştu');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teknik Kadro</h1>
        <Button onClick={() => router.push('/admin/technical-staff/new')}>
          Yeni Üye Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div key={member._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{member.name}</h2>
                <p className="text-gray-600">{member.position}</p>
                <p className="text-gray-600">{member.qualification}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Deneyim: {member.experience} yıl
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(member._id)}
              >
                Düzenle
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(member._id)}
              >
                Sil
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 