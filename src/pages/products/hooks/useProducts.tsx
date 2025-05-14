
import { useState, useEffect, useMemo } from 'react';

// Define the product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  category: string;
  stock: number;
  minStock: number;
  allowInstallments: boolean;
  maxInstallments: number;
  installmentFee: number;
  images?: string[];
  cost?: number;
  supplier?: string;
  supplierContact?: string;
  dateAdded?: string;
  lastUpdated?: string;
}

// Initial mock data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Sapatilha de Ballet",
    description: "Sapatilha de ballet em couro, perfeita para aulas e apresentações.",
    sku: "SPT-001",
    price: 99.90,
    category: "Calçados",
    stock: 25,
    minStock: 5,
    allowInstallments: true,
    maxInstallments: 3,
    installmentFee: 0,
    images: [],
    cost: 65.00,
    supplier: "Ballet Supplies Inc.",
    supplierContact: "contato@balletsupplies.com",
    dateAdded: "2023-01-15",
    lastUpdated: "2023-05-20"
  },
  {
    id: "2",
    name: "Collant Infantil",
    description: "Collant em helanca, ideal para aulas de ballet infantil.",
    sku: "COL-002",
    price: 75.50,
    category: "Vestuário",
    stock: 15,
    minStock: 3,
    allowInstallments: true,
    maxInstallments: 2,
    installmentFee: 0,
    images: [],
    cost: 45.00,
    supplier: "Dance Wear Co.",
    supplierContact: "pedidos@dancewear.com",
    dateAdded: "2023-02-10",
    lastUpdated: "2023-05-15"
  },
  {
    id: "3",
    name: "Meia Calça Ballet",
    description: "Meia calça resistente, especial para ballet.",
    sku: "MCA-003",
    price: 45.90,
    category: "Acessórios",
    stock: 30,
    minStock: 10,
    allowInstallments: false,
    maxInstallments: 0,
    installmentFee: 0,
    images: [],
    cost: 25.00,
    supplier: "Dance Wear Co.",
    supplierContact: "pedidos@dancewear.com",
    dateAdded: "2023-03-05",
    lastUpdated: "2023-04-10"
  },
  {
    id: "4",
    name: "Uniforme Hip Hop",
    description: "Conjunto de moletom para aulas de hip hop.",
    sku: "UNF-004",
    price: 199.90,
    category: "Vestuário",
    stock: 8,
    minStock: 5,
    allowInstallments: true,
    maxInstallments: 6,
    installmentFee: 2.5,
    images: [],
    cost: 120.00,
    supplier: "Urban Dance Supplies",
    supplierContact: "vendas@urbandance.com",
    dateAdded: "2023-03-20",
    lastUpdated: "2023-05-22"
  },
  {
    id: "5",
    name: "Fita Adesiva para Sapatilha",
    description: "Fita especial para proteger sapatilhas de ponta.",
    sku: "FIT-005",
    price: 15.90,
    category: "Acessórios",
    stock: 50,
    minStock: 15,
    allowInstallments: false,
    maxInstallments: 0,
    installmentFee: 0,
    images: [],
    cost: 7.50,
    supplier: "Ballet Supplies Inc.",
    supplierContact: "contato@balletsupplies.com",
    dateAdded: "2023-04-05",
    lastUpdated: "2023-05-01"
  }
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Simulated loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Extract categories from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [products]);

  // Filter products based on search term and selected category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by search term
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
      
      // Filter by category
      const matchesCategory = 
        selectedCategory === 'all' || 
        product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Add a new product
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(), // Generate a unique ID
      lastUpdated: new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString().split('T')[0]
    } as Product;
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  // Update an existing product
  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
          ? { 
              ...product, 
              ...productData, 
              lastUpdated: new Date().toISOString().split('T')[0]
            } 
          : product
      )
    );
  };

  // Delete a product
  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  return {
    products,
    filteredProducts,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    searchTerm,
    setSearchTerm,
    categories,
    selectedCategory,
    setSelectedCategory
  };
}
