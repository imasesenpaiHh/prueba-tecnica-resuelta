// ============================================
// ARCHIVO: /src/components/ProductList.tsx
// ============================================
import React from "react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  error,
  onEdit,
  onDelete,
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
    return (
      <div className="error">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty">
        <p>No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
