import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Camera, Server, MapPin, Star, Clock, Shield, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

function Home() {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>

        {/* Fixed Social Media Buttons */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
          {settings?.social_facebook && (
            <motion.a
              href={settings.social_facebook}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </motion.a>
          )}
          {settings?.social_instagram && (
            <motion.a
              href={settings.social_instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white p-3 rounded-full hover:opacity-90 transition-opacity shadow-lg"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
              </svg>
            </motion.a>
          )}
          {settings?.social_whatsapp && (
            <motion.button
              onClick={() => {
                const message = encodeURIComponent(settings.whatsapp_message || 'Merhaba, bilgi almak istiyorum.');
                const url = `https://wa.me/${settings.social_whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
                window.open(url, '_blank');
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-lg"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
              </svg>
            </motion.button>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo */}
            {settings?.logo_url && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative mb-12"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl transform -skew-y-2" />
                <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/10">
                  <motion.img
                    src={settings.logo_url}
                    alt={settings.company_name}
                    className="h-48 w-auto mx-auto object-contain filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  />
                </div>
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-3xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </motion.div>
            )}
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative inline-block"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 relative z-10"
                style={{
                  textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)'
                }}
              >
                <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 text-transparent bg-clip-text">
                  {settings?.company_name || 'TGuard Teknoloji'}
                </span>
                <motion.span
                  className="absolute -inset-x-2 inset-y-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </motion.h1>
            </motion.div>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 relative"
            >
              <span className="relative">
                Profesyonel Bilişim ve Güvenlik Çözümleri
                <motion.span
                  className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </span>
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-lg font-medium rounded-full text-white transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Hemen Teklif Alın
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Mutlu Müşteri</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-400">Tamamlanan Proje</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <Clock className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">10+</div>
              <div className="text-gray-400">Yıllık Deneyim</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <Shield className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">7/24</div>
              <div className="text-gray-400">Teknik Destek</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hizmet Bölgeleri */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hizmet Bölgelerimiz</h2>
            <p className="text-gray-600">Antalya'nın doğusunda profesyonel hizmet veriyoruz</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Serik', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800' },
              { name: 'Manavgat', image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800' },
              { name: 'Belek', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800' },
              { name: 'Kadriye', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' },
              { name: 'Boğazkent', image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&q=80&w=800' },
              { name: 'Çevre Köyler', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' }
            ].map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden rounded-xl"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-white mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-white">{location.name}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Çözüm Sürecimiz */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Çözüm Sürecimiz</h2>
            <p className="text-gray-600">Profesyonel ve sistematik yaklaşımımızla size en iyi hizmeti sunuyoruz</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Keşif ve Planlama',
                description: 'İhtiyaçlarınızı analiz eder, en uygun çözümü planlarız',
                icon: <Monitor className="h-8 w-8" />
              },
              {
                title: 'Altyapı Analizi',
                description: 'Mevcut altyapınızı inceler, gerekli iyileştirmeleri belirleriz',
                icon: <Server className="h-8 w-8" />
              },
              {
                title: 'Kurulum',
                description: 'Profesyonel ekibimizle hızlı ve güvenli kurulum yaparız',
                icon: <Camera className="h-8 w-8" />
              },
              {
                title: 'Destek ve Bakım',
                description: '7/24 teknik destek ve düzenli bakım hizmeti sunarız',
                icon: <Wrench className="h-8 w-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="text-blue-600 mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h2>
            <p className="text-gray-600">Merak ettiğiniz soruların cevapları</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
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
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;