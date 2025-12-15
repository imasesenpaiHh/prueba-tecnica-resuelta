// ============================================
// ARCHIVO: /src/hooks/useProducts.ts
// ============================================
import { useState, useEffect, useMemo } from "react";
import { Product } from "../types";
import { getProducts } from "../services/api";

const PRODUCTS_PER_PAGE = 6;

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch inicial de productos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Error al cargar los productos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrado con useMemo para optimizar
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Reset página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProductInList = (id: number, updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
  };

  const deleteProductFromList = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    products: paginatedProducts,
    allProducts: products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addProduct,
    updateProductInList,
    deleteProductFromList,
  };
};
