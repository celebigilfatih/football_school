"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { clubService } from "@/services/club.service";
import { toast } from "react-hot-toast";

export default function AdminClub() {
  const [club, setClub] = useState<any>({
    name: "",
    address: "",
    phone: "",
    email: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
      whatsapp: "",
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        setLoading(true);
        const data = await clubService.getClubInfo();
        setClub(data);
        if (data.logo) {
          setLogoPreview(data.logo);
        }
      } catch (error) {
        console.error("Error fetching club info:", error);
        toast.error("Kulüp bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setClub((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setClub((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLogoChange = (file: File | null) => {
    setLogoFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(club.logo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const formData = new FormData();
      
      // Append club data
      formData.append("name", club.name);
      formData.append("address", club.address);
      formData.append("phone", club.phone);
      formData.append("email", club.email);
      
      // Append social media data
      Object.entries(club.socialMedia).forEach(([key, value]) => {
        formData.append(`socialMedia.${key}`, value as string);
      });
      
      // Append logo if changed
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      
      // FormData içeriğini kontrol et
      console.log("Gönderilecek veriler:");
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
      
      const response = await clubService.updateClubInfo(formData);
      console.log("API yanıtı:", response);
      
      // Güncelleme başarılı olduğunda, sayfayı yeniden yükle
      window.location.reload();
      
      toast.success("Kulüp bilgileri başarıyla güncellendi.");
    } catch (error) {
      console.error("Error updating club info:", error);
      toast.error("Kulüp bilgileri güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kulüp Bilgileri</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="max-w-xs">
              <FileUpload
                label="Kulüp Logosu"
                onFileChange={handleLogoChange}
                previewUrl={logoPreview}
                accept="image/*"
              />
              <p className="text-xs text-gray-500 mt-1">
                Önerilen boyut: 200x200px, PNG veya JPG formatı
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Kulüp Adı</Label>
                <Input
                  id="name"
                  name="name"
                  value={club.name}
                  onChange={handleInputChange}
                  placeholder="Kulüp adını girin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={club.email}
                  onChange={handleInputChange}
                  placeholder="E-posta adresini girin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={club.phone}
                  onChange={handleInputChange}
                  placeholder="Telefon numarasını girin"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={club.address}
                  onChange={handleInputChange}
                  placeholder="Kulüp adresini girin"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sosyal Medya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                name="socialMedia.facebook"
                value={club.socialMedia.facebook}
                onChange={handleInputChange}
                placeholder="Facebook sayfası URL'si"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="socialMedia.twitter"
                value={club.socialMedia.twitter}
                onChange={handleInputChange}
                placeholder="Twitter sayfası URL'si"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="socialMedia.instagram"
                value={club.socialMedia.instagram}
                onChange={handleInputChange}
                placeholder="Instagram sayfası URL'si"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                name="socialMedia.youtube"
                value={club.socialMedia.youtube}
                onChange={handleInputChange}
                placeholder="YouTube kanalı URL'si"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="socialMedia.whatsapp"
                value={club.socialMedia.whatsapp}
                onChange={handleInputChange}
                placeholder="WhatsApp URL'si (örn: https://wa.me/905551234567)"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="mr-2">Kaydediliyor</span>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : (
              "Kaydet"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 