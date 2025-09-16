'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Announcement, announcementService } from '@/services/announcement.service';
import { Group, groupService } from '@/services/group.service';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon } from "lucide-react";

type Priority = 'Düşük' | 'Normal' | 'Yüksek' | 'Acil';

export default function AdminAnnouncementForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [announcement, setAnnouncement] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    priority: 'Normal',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    targetGroups: [],
    isActive: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await groupService.getAll();
        setGroups(groupsData);

        if (!isNew) {
          const data = await announcementService.getById(resolvedParams.id);
          setAnnouncement(data);
        }
        
        setError(null);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNew, resolvedParams.id]);

  const handleChange = (name: string, value: string | boolean | Priority) => {
    setAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGroupToggle = (groupId: string) => {
    setAnnouncement(prev => ({
      ...prev,
      targetGroups: prev.targetGroups?.includes(groupId)
        ? prev.targetGroups.filter(id => id !== groupId)
        : [...(prev.targetGroups || []), groupId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isNew) {
        await announcementService.create(announcement as Omit<Announcement, 'id'>);
      } else {
        await announcementService.update(resolvedParams.id, announcement);
      }
      router.push('/admin/announcements');
    } catch (err) {
      setError('Duyuru kaydedilirken bir hata oluştu');
      console.error('Error saving announcement:', err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Yeni Duyuru Ekle' : 'Duyuruyu Düzenle'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              value={announcement.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">İçerik</Label>
            <Textarea
              id="content"
              value={announcement.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Öncelik</Label>
            <Select
              value={announcement.priority}
              onValueChange={(value: Priority) => handleChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Öncelik seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Düşük">Düşük</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Yüksek">Yüksek</SelectItem>
                <SelectItem value="Acil">Acil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={announcement.startDate?.toString().split('T')[0]}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={announcement.endDate?.toString().split('T')[0]}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                />
                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hedef Gruplar</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent"
                >
                  <Checkbox
                    id={`group-${group.id}`}
                    checked={announcement.targetGroups?.includes(group.id)}
                    onCheckedChange={() => handleGroupToggle(group.id)}
                  />
                  <Label
                    htmlFor={`group-${group.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {group.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={announcement.isActive}
              onCheckedChange={(checked: boolean) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive" className="font-normal">
              Aktif
            </Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/announcements')}
            >
              İptal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 