import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Grid, List, X, Search, Filter, Star } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import ProductDetail from '../components/ProductDetail';
import type { Product } from '../types';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('featured_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map(item => item.category).filter(Boolean))
      ) as string[];
      
      setProducts(data || []);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => 
      (!selectedCategory || product.category === selectedCategory) &&
      (!searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.features.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    );

  // Öne çıkan ürünleri ayır
  const featuredProducts = filteredProducts.filter(p => p.is_featured);
  const regularProducts = filteredProducts.filter(p => !p.is_featured);

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle 
          title="Ürünlerimiz"
          subtitle="Kaliteli ve güvenilir teknoloji çözümleri"
        />

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg shadow p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">Kategoriler</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${!selectedCategory ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                >
                  Tümü
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${selectedCategory === category ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Öne Çıkan Ürünler */}
            {featuredProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
                </div>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {featuredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      viewMode={viewMode}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Diğer Ürünler */}
            {regularProducts.length > 0 && (
              <div>
                {featuredProducts.length > 0 && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tüm Ürünler</h2>
                )}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {regularProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      viewMode={viewMode}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

function ProductCard({ product, index, viewMode, onClick }: ProductCardProps) {
  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={onClick}
      >
        <div className="relative h-48 sm:h-64">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product.is_featured && (
            <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">Öne Çıkan</span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <div className="space-y-1">
            {product.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm sm:text-base text-gray-600">
                <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
            {product.features.length > 3 && (
              <div className="text-sm text-blue-600">
                +{product.features.length - 3} özellik daha
              </div>
            )}
          </div>
          {product.price && (
            <div className="mt-4 text-xl font-bold text-blue-600">
              {product.price.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY'
              })}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-48 h-48">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full mb-3">
                {product.category}
              </span>
            </div>
            {product.is_featured && (
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full mb-3 sm:mb-0">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">Öne Çıkan</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-gray-600">
                <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          {product.price && (
            <div className="mt-4 text-xl font-bold text-blue-600">
              {product.price.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY'
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Products;