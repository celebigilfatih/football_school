'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Group, Player, groupService } from '@/services/group.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function AdminGroupForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [group, setGroup] = useState<Partial<Group>>({
    name: '',
    description: '',
    imageUrl: '',
    schedule: [
      {
        day: 'Pazartesi',
        startTime: '09:00',
        endTime: '10:30'
      }
    ],
    trainer: {
      name: '',
      qualification: ''
    },
    players: [],
    isActive: true
  });

  useEffect(() => {
    if (!resolvedParams.id) {
      router.replace('/admin/groups');
      return;
    }

    const fetchGroup = async () => {
      if (isNew) {
        setLoading(false);
        return;
      }

      try {
        const data = await groupService.getById(resolvedParams.id);
        console.log('Fetched group data:', data);
        
        // Ensure players array exists
        const updatedData = {
          ...data,
          players: data.players || [],
          imageUrl: data.imageUrl || ''
        };
        
        setGroup(updatedData);
        setError(null);
      } catch (err) {
        setError('Grup bilgileri yüklenirken bir hata oluştu');
        console.error('Error fetching group:', err);
        toast.error('Grup bilgileri yüklenirken bir hata oluştu');
        router.push('/admin/groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [isNew, resolvedParams.id, router]);

  const handleChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setGroup(prev => {
        const parentObj = prev[parent as keyof Group] || {};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setGroup(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    setGroup(prev => ({
      ...prev,
      schedule: prev.schedule?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSchedule = () => {
    setGroup(prev => ({
      ...prev,
      schedule: [
        ...(prev.schedule || []),
        { day: 'Pazartesi', startTime: '09:00', endTime: '10:30' }
      ]
    }));
  };

  const removeSchedule = (index: number) => {
    setGroup(prev => ({
      ...prev,
      schedule: prev.schedule?.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setGroup(prev => ({
        ...prev,
        imageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const addPlayer = () => {
    setGroup(prev => {
      const currentGroup = prev as Required<Pick<Group, 'players'>>;
      const newPlayer = {
        firstName: '',
        lastName: '',
        birthDate: '',
        position: ''
      };
      return Object.assign({}, prev, {
        players: [...(currentGroup.players || []), newPlayer]
      });
    });
  };

  const removePlayer = (index: number) => {
    setGroup(prev => {
      const currentGroup = prev as Required<Pick<Group, 'players'>>;
      return Object.assign({}, prev, {
        players: currentGroup.players.filter((_, i) => i !== index)
      });
    });
  };

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    setGroup(prev => {
      const currentGroup = prev as Required<Pick<Group, 'players'>>;
      return Object.assign({}, prev, {
        players: currentGroup.players.map((player, i) => 
          i === index ? Object.assign({}, player, { [field]: value }) : player
        )
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!group.name) {
        throw new Error('Grup adı zorunludur');
      }
      if (!group.description) {
        throw new Error('Açıklama zorunludur');
      }
      if (!group.trainer?.name) {
        throw new Error('Eğitmen adı zorunludur');
      }
      if (!group.trainer?.qualification) {
        throw new Error('Eğitmen yeterliliği zorunludur');
      }

      // Prepare group data
      const groupData: Omit<Group, '_id'> = {
        name: group.name,
        description: group.description,
        imageUrl: group.imageUrl,
        schedule: group.schedule || [],
        trainer: {
          name: group.trainer?.name || '',
          qualification: group.trainer?.qualification || ''
        },
        players: group.players || [],
        isActive: group.isActive ?? true,
        type: 'Alt Yapı'
      };

      console.log('Submitting group data:', groupData);

      if (isNew) {
        await groupService.create(groupData, imageFile || undefined);
        toast.success('Grup başarıyla oluşturuldu');
      } else {
        await groupService.update(resolvedParams.id, groupData, imageFile || undefined);
        toast.success('Grup başarıyla güncellendi');
      }
      router.push('/admin/groups');
    } catch (err) {
      let errorMessage = 'Grup kaydedilirken bir hata oluştu';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error saving group:', err);
      toast.error(errorMessage);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Yeni Grup Ekle' : 'Grubu Düzenle'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Grup Adı</Label>
                <Input
                  id="name"
                  value={group.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={group.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="image">Takım Resmi</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
                {group.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={group.imageUrl}
                      alt="Takım Resmi"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Antrenman Programı</Label>
                <div className="space-y-2">
                  {group.schedule?.map((schedule, index) => (
                    <div key={`schedule-item-${index}`} className="flex items-center gap-4">
                      <Select
                        value={schedule.day}
                        onValueChange={(value) => handleScheduleChange(index, 'day', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Gün seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => (
                            <SelectItem key={`day-${day}`} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                        className="w-[150px]"
                      />
                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                        className="w-[150px]"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeSchedule(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSchedule}
                    className="mt-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 5v14M5 12h14"/></svg>
                    Program Ekle
                  </Button>
                </div>
              </div>

              <div>
                <Label>Oyuncular</Label>
                <div className="space-y-4">
                  {group.players?.map((player, index) => (
                    <div key={`player-${index}`} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Oyuncu {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removePlayer(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`player-${index}-firstName`}>Ad</Label>
                          <Input
                            id={`player-${index}-firstName`}
                            value={player.firstName}
                            onChange={(e) => handlePlayerChange(index, 'firstName', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`player-${index}-lastName`}>Soyad</Label>
                          <Input
                            id={`player-${index}-lastName`}
                            value={player.lastName}
                            onChange={(e) => handlePlayerChange(index, 'lastName', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`player-${index}-birthDate`}>Doğum Tarihi</Label>
                          <Input
                            id={`player-${index}-birthDate`}
                            type="date"
                            value={player.birthDate}
                            onChange={(e) => handlePlayerChange(index, 'birthDate', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`player-${index}-position`}>Mevki</Label>
                          <Select
                            value={player.position}
                            onValueChange={(value) => handlePlayerChange(index, 'position', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Mevki seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                'Kaleci',
                                'Defans',
                                'Orta Saha',
                                'Forvet'
                              ].map((pos) => (
                                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPlayer}
                    className="w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 5v14M5 12h14"/></svg>
                    Oyuncu Ekle
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="trainer.name">Eğitmen Adı</Label>
                <Input
                  id="trainer.name"
                  value={group.trainer?.name}
                  onChange={(e) => handleChange('trainer.name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="trainer.qualification">Eğitmen Yeterliliği</Label>
                <Input
                  id="trainer.qualification"
                  value={group.trainer?.qualification}
                  onChange={(e) => handleChange('trainer.qualification', e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={group.isActive}
                  onCheckedChange={(checked) => setGroup(prev => ({ ...prev, isActive: checked as boolean }))}
                />
                <Label htmlFor="isActive" className="font-normal">Aktif</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/groups')}
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
    </div>
  );
} 