import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Award } from 'lucide-react';
import PageTitle from '../components/PageTitle';

function About() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle 
          title="Hakkımızda"
          subtitle="TGuard Teknoloji olarak, modern çağın teknolojik ihtiyaçlarına profesyonel çözümler sunuyoruz."
        />

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <Target className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Vizyonumuz</h2>
            <p className="text-gray-600">
              Teknoloji dünyasında güvenilir bir çözüm ortağı olarak, müşterilerimizin dijital dönüşümüne öncülük etmek.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Misyonumuz</h2>
            <p className="text-gray-600">
              Yenilikçi teknoloji çözümleriyle müşterilerimizin iş süreçlerini optimize etmek ve güvenliklerini sağlamak.
            </p>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Neden TGuard?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Uzman Ekip</h3>
              <p className="text-gray-600">
                Deneyimli ve profesyonel teknik ekibimizle kaliteli hizmet sunuyoruz.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Kaliteli Hizmet</h3>
              <p className="text-gray-600">
                En son teknolojileri kullanarak müşteri memnuniyetini en üst düzeyde tutuyoruz.
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Güvenilir Çözümler</h3>
              <p className="text-gray-600">
                Güvenlik odaklı yaklaşımımızla işinizi koruma altına alıyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;