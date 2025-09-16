'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { News, newsService } from '@/services/news.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

type NewsCategory = News['category'];

export default function NewNewsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    category: 'Genel' as NewsCategory,
    author: '',
    isPublished: true,
    publishDate: new Date().toISOString(),
    tags: [] as string[]
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({ ...prev, image: base64 }));
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        toast.error('Fotoğraf yüklenirken bir hata oluştu');
        console.error('Error uploading image:', error);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        toast.error('Başlık alanı zorunludur');
        setIsSubmitting(false);
        return;
      }

      if (!formData.content.trim()) {
        toast.error('İçerik alanı zorunludur');
        setIsSubmitting(false);
        return;
      }

      if (!formData.author.trim()) {
        toast.error('Yazar alanı zorunludur');
        setIsSubmitting(false);
        return;
      }

      const newsData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        tags: formData.tags.map(tag => tag.trim()).filter(Boolean)
      };

      await newsService.create(newsData);
      toast.success('Haber başarıyla eklendi');
      router.push('/admin/news');
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Haber eklenirken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Haber Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Yazar</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Genel">Genel</SelectItem>
                    <SelectItem value="Turnuva">Turnuva</SelectItem>
                    <SelectItem value="Eğitim">Eğitim</SelectItem>
                    <SelectItem value="Başarı">Başarı</SelectItem>
                    <SelectItem value="Diğer">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Fotoğraf</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={imagePreview}
                        alt="News preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, GIF dosyaları (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-full space-y-2">
                <Label htmlFor="content">İçerik</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 