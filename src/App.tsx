// ============================================
// ARCHIVO: /src/App.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { Pagination } from './components/Pagination';
import './App.css';

const API_URL = 'https://fakestoreapi.com/products';
const PRODUCTS_PER_PAGE = 6;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // NIVEL 1: Fetch inicial de productos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }
        
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // NIVEL 2: Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset página al buscar
    }, 500);

    // Cleanup: cancelar el timer anterior si searchQuery cambia
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // NIVEL 2: Función para crear producto
  const handleCreateProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Error al crear producto');
      }

      const newProduct: Product = await response.json();
      
      // Agregar al inicio de la lista
      setProducts(prev => [newProduct, ...prev]);
      setShowForm(false);
      
      alert('✅ Producto creado exitosamente');
    } catch (err) {
      alert('❌ Error al crear producto');
      console.error(err);
    }
  };

  // Filtrado de productos
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // NIVEL 3 (BONUS): Paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="App">
      <header>
        <h1>🛍️ Catálogo de Productos</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button onClick={() => setShowForm(true)} className="btn-create">
          ➕ Crear Producto
        </button>
      </div>

      <main>
        <ProductList
          products={paginatedProducts}
          loading={loading}
          error={error}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {showForm && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;

