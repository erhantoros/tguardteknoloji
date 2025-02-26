import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import type { Product } from '../types';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);

  // Fetch cart on mount and when user changes
  useEffect(() => {
    if (user?.email) {
      fetchCart();
    } else {
      // Load from localStorage for non-authenticated users
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setLoading(false);
    }
  }, [user]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

  const fetchCart = async () => {
    try {
      // Get user's cart
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_email', user?.email)
        .single();

      if (cartError) {
        if (cartError.code === 'PGRST204') {
          // Cart doesn't exist, create one
          const { data: newCart, error: createError } = await supabase
            .from('carts')
            .insert({ user_email: user?.email })
            .select()
            .single();

          if (createError) throw createError;
          cartData = newCart;
        } else {
          throw cartError;
        }
      }

      setCartId(cartData.id);

      // Get cart items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product:products (
            id,
            title,
            price,
            image_url
          )
        `)
        .eq('cart_id', cartData.id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: Product) => {
    try {
      if (user?.email && cartId) {
        // Check if item already exists
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          await updateQuantity(existingItem.id, existingItem.quantity + 1);
        } else {
          const { error } = await supabase
            .from('cart_items')
            .insert({
              cart_id: cartId,
              product_id: product.id,
              quantity: 1
            });

          if (error) throw error;
          await fetchCart();
        }
      } else {
        // Handle non-authenticated users
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          updateQuantity(existingItem.id, existingItem.quantity + 1);
        } else {
          setItems(prev => [...prev, {
            id: Math.random().toString(36).substring(2),
            product,
            quantity: 1
          }]);
        }
      }
      
      toast.success('Ürün sepete eklendi');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeItem(itemId);
    }

    try {
      if (user?.email && cartId) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
        await fetchCart();
      } else {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        ));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      if (user?.email && cartId) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
        await fetchCart();
      } else {
        setItems(prev => prev.filter(item => item.id !== itemId));
      }
      
      toast.success('Ürün sepetten kaldırıldı');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (user?.email && cartId) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId);

        if (error) throw error;
        await fetchCart();
      } else {
        setItems([]);
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const total = items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  return {
    items,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total
  };
}