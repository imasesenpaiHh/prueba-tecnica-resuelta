// ============================================
// ARCHIVO: /src/components/ProductCard.tsx
// ============================================
import React from "react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const { addToCart } = useCart();

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${product.title}"?`)) {
      onDelete?.(product.id);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <p className="category">{product.category}</p>

      <div className="actions">
        <button onClick={() => addToCart(product)} className="btn-primary">
          Agregar al carrito
        </button>

        {onEdit && (
          <button onClick={() => onEdit(product)} className="btn-secondary">
            Editar
          </button>
        )}

        {onDelete && (
          <button onClick={handleDelete} className="btn-danger">
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};
