import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCategories(type: 'product' | 'gallery' | 'service') {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('type', type)
        .order('name');

      if (error) throw error;
      setCategories(data.map(cat => cat.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading };
}