import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../../../hooks/useSiteSettings';
import FileUpload from '../../../components/FileUpload';
import toast from 'react-hot-toast';

interface ServiceArea {
  name: string;
  image: string;
}

interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

interface FAQ {
  question: string;
  answer: string;
}

function HomeSettings() {
  const { settings, updateSettings } = useSiteSettings();
  const [stats, setStats] = useState({
    customers: settings?.stats_customers || '500+',
    projects: settings?.stats_projects || '1000+',
    experience: settings?.stats_experience || '10+',
    support: settings?.stats_support || '7/24'
  });

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(
    settings?.home_service_areas ? JSON.parse(settings.home_service_areas) : [
      { name: 'Serik', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800' },
      { name: 'Manavgat', image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800' },
      { name: 'Belek', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800' },
      { name: 'Kadriye', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' },
      { name: 'Boğazkent', image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&q=80&w=800' },
      { name: 'Çevre Köyler', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' }
    ]
  );

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(
    settings?.home_process_steps ? JSON.parse(settings.home_process_steps) : [
      {
        title: 'Keşif ve Planlama',
        description: 'İhtiyaçlarınızı analiz eder, en uygun çözümü planlarız',
        icon: 'Monitor'
      },
      {
        title: 'Altyapı Analizi',
        description: 'Mevcut altyapınızı inceler, gerekli iyileştirmeleri belirleriz',
        icon: 'Server'
      },
      {
        title: 'Kurulum',
        description: 'Profesyonel ekibimizle hızlı ve güvenli kurulum yaparız',
        icon: 'Camera'
      },
      {
        title: 'Destek ve Bakım',
        description: '7/24 teknik destek ve düzenli bakım hizmeti sunarız',
        icon: 'Wrench'
      }
    ]
  );

  const [faqs, setFaqs] = useState<FAQ[]>(
    settings?.home_faqs ? JSON.parse(settings.home_faqs) : [
      {
        question: 'Kurulum süresi ne kadar?',
        answer: 'Projenin büyüklüğüne göre değişmekle birlikte, genellikle 1-3 iş günü içerisinde kurulum tamamlanır.'
      },
      {
        question: 'Garanti süresi nedir?',
        answer: 'Tüm ürün ve hizmetlerimiz 2 yıl garantilidir. Bu süre içinde teknik destek ve bakım hizmeti sunuyoruz.'
      },
      {
        question: 'Ödeme seçenekleri nelerdir?',
        answer: 'Nakit, kredi kartı ve kurumsal müşterilerimiz için çek ile ödeme kabul ediyoruz. Ayrıca taksit seçeneklerimiz mevcuttur.'
      },
      {
        question: 'Bakım hizmetleri nasıl işliyor?',
        answer: 'Düzenli bakım hizmetlerimiz 3 ayda bir yapılır. Acil durumlarda 24 saat içinde müdahale garantisi veriyoruz.'
      }
    ]
  );

  const handleStatsChange = (key: string, value: string) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  const handleServiceAreaChange = (index: number, field: keyof ServiceArea, value: string) => {
    const newAreas = [...serviceAreas];
    newAreas[index] = { ...newAreas[index], [field]: value };
    setServiceAreas(newAreas);
  };

  const handleServiceAreaImageUpload = (index: number, url: string) => {
    handleServiceAreaChange(index, 'image', url);
  };

  const handleProcessStepChange = (index: number, field: keyof ProcessStep, value: string) => {
    const newSteps = [...processSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setProcessSteps(newSteps);
  };

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    const newFAQs = [...faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFaqs(newFAQs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await updateSettings({
        stats_customers: stats.customers,
        stats_projects: stats.projects,
        stats_experience: stats.experience,
        stats_support: stats.support,
        home_service_areas: JSON.stringify(serviceAreas),
        home_process_steps: JSON.stringify(processSteps),
        home_faqs: JSON.stringify(faqs)
      });

      if (error) throw error;
      toast.success('Ana sayfa ayarları başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating home settings:', error);
      toast.error('Ayarlar güncellenirken bir hata oluştu');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Ana Sayfa Ayarları</h1>

      <div className="space-y-8">
        {/* İstatistikler */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">İstatistikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Müşteri Sayısı
              </label>
              <input
                type="text"
                value={stats.customers}
                onChange={(e) => handleStatsChange('customers', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="500+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Tamamlanan Proje
              </label>
              <input
                type="text"
                value={stats.projects}
                onChange={(e) => handleStatsChange('projects', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="1000+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Yıllık Deneyim
              </label>
              <input
                type="text"
                value={stats.experience}
                onChange={(e) => handleStatsChange('experience', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="10+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Teknik Destek
              </label>
              <input
                type="text"
                value={stats.support}
                onChange={(e) => handleStatsChange('support', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="7/24"
              />
            </div>
          </div>
        </div>

        {/* Hizmet Bölgeleri */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Hizmet Bölgeleri</h2>
          <div className="space-y-4">
            {serviceAreas.map((area, index) => (
              <div key={index} className="space-y-4 p-4 border border-gray-700 rounded-lg">
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Bölge Adı
                    </label>
                    <input
                      type="text"
                      value={area.name}
                      onChange={(e) => handleServiceAreaChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newAreas = serviceAreas.filter((_, i) => i !== index);
                      setServiceAreas(newAreas);
                    }}
                    className="mt-7 p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Resim
                  </label>
                  {area.image && (
                    <img
                      src={area.image}
                      alt={area.name}
                      className="w-32 h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={area.image}
                        onChange={(e) => handleServiceAreaChange(index, 'image', e.target.value)}
                        placeholder="Resim URL'si"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <FileUpload
                        onUpload={(url) => handleServiceAreaImageUpload(index, url)}
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setServiceAreas([...serviceAreas, { name: '', image: '' }])}
              className="flex items-center text-blue-400 hover:text-blue-300"
            >
              <Plus className="h-4 w-4 mr-1" />
              Bölge Ekle
            </button>
          </div>
        </div>

        {/* Çözüm Süreci */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Çözüm Süreci</h2>
          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={index} className="space-y-2 p-4 border border-gray-700 rounded-lg">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleProcessStepChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      İkon
                    </label>
                    <select
                      value={step.icon}
                      onChange={(e) => handleProcessStepChange(index, 'icon', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Monitor">Monitor</option>
                      <option value="Camera">Camera</option>
                      <option value="Server">Server</option>
                      <option value="Wrench">Wrench</option>
                      <option value="Shield">Shield</option>
                      <option value="Wifi">Wifi</option>
                      <option value="HardDrive">HardDrive</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSteps = processSteps.filter((_, i) => i !== index);
                      setProcessSteps(newSteps);
                    }}
                    className="mt-7 p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => handleProcessStepChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProcessSteps([...processSteps, { title: '', description: '', icon: 'Monitor' }])}
              className="flex items-center text-blue-400 hover:text-blue-300"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adım Ekle
            </button>
          </div>
        </div>

        {/* SSS */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2 p-4 border border-gray-700 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Soru
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFAQs = faqs.filter((_, i) => i !== index);
                        setFaqs(newFAQs);
                      }}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Cevap
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
              className="flex items-center text-blue-400 hover:text-blue-300"
            >
              <Plus className="h-4 w-4 mr-1" />
              Soru Ekle
            </button>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-5 w-5 mr-2" />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeSettings;