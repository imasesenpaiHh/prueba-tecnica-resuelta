// ============================================
// ARCHIVO: /src/components/ProductList.tsx
// ============================================
import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error?: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  loading,
  error 
}) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">❌ {error}</div>;
  }

  if (products.length === 0) {
    return <div className="empty">No se encontraron productos</div>;
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};