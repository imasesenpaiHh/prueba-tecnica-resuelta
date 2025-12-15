// ============================================
// ARCHIVO: /src/App.tsx
// ============================================
import React, { useState, useCallback } from "react";
import { CartProvider, useCart } from "./context/CartContext";
import { SearchBar } from "./components/SearchBar";
import { ProductList } from "./components/ProductList";
import { Pagination } from "./components/Pagination";
import { ProductForm } from "./components/ProductForm";
import { useProducts } from "./hooks/useProducts";
import { createProduct, updateProduct, deleteProduct } from "./services/api";
import { Product } from "./types";
import "./App.css";

function AppContent() {
  const {
    products,
    loading,
    error,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    addProduct,
    updateProductInList,
    deleteProductFromList,
  } = useProducts();

  const { totalItems } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleCreateProduct = async (productData: Omit<Product, "id">) => {
    try {
      const newProduct = await createProduct(productData);
      addProduct(newProduct);
      showNotification("✅ Producto creado exitosamente");
    } catch (err) {
      showNotification("❌ Error al crear producto");
      throw err;
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, "id">) => {
    if (!editingProduct) return;

    try {
      const updated = await updateProduct(editingProduct.id, productData);
      updateProductInList(editingProduct.id, updated);
      showNotification("✅ Producto actualizado exitosamente");
    } catch (err) {
      showNotification("❌ Error al actualizar producto");
      throw err;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      deleteProductFromList(id);
      showNotification("✅ Producto eliminado exitosamente");
    } catch (err) {
      showNotification("❌ Error al eliminar producto");
      throw err;
    }
  };

  const openCreateModal = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="App">
      <header>
        <h1>🛍️ Dashboard de Productos</h1>
        <div className="cart-badge">🛒 Carrito: {totalItems} items</div>
      </header>

      <div className="controls">
        <SearchBar onSearch={setSearchQuery} />
        <button onClick={openCreateModal} className="btn-create">
          ➕ Crear Producto
        </button>
      </div>

      <main>
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onEdit={openEditModal}
          onDelete={handleDeleteProduct}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={closeModal}
        />
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
