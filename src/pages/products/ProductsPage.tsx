
import React, { useState } from "react";
import { ShoppingBag, Plus, Search, Tag, Package } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "./components/ProductForm";
import { toast } from "sonner";
import { useProducts } from "./hooks/useProducts";
import { ProductDetails } from "./components/ProductDetails";

const ProductsPage = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    filteredProducts,
    searchTerm,
    setSearchTerm,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading
  } = useProducts();
  
  const [openProductForm, setOpenProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleAddEditProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success(`Produto ${productData.name} atualizado com sucesso!`);
    } else {
      addProduct(productData);
      toast.success(`Produto ${productData.name} cadastrado com sucesso!`);
    }
    setOpenProductForm(false);
    setEditingProduct(null);
  };

  const handleOpenProductForm = (product?: any) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct(null);
    }
    setOpenProductForm(true);
  };

  const handleViewProduct = (product: any) => {
    setViewingProduct(product);
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      const product = products.find(p => p.id === productToDelete);
      deleteProduct(productToDelete);
      toast.success(`Produto ${product?.name || ''} removido com sucesso!`);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Produtos"
        subtitle="Gerencie uniformes e produtos da escola de dança"
        icon={ShoppingBag}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => handleOpenProductForm()}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </PageTitle>

      {products.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum produto cadastrado</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre seu primeiro produto para começar.
              </p>
              <Button 
                className="bg-dance-primary hover:bg-dance-secondary"
                onClick={() => handleOpenProductForm()}
              >
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Produto
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-sm mt-6">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className={selectedCategory === "all" ? "bg-dance-primary hover:bg-dance-secondary" : ""}
                >
                  Todos
                </Button>
                
                {categories.map((category) => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-dance-primary hover:bg-dance-secondary" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dance-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Parcelamento</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Nenhum produto encontrado para o filtro selecionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.sku || "Sem código"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          R$ {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                              {product.stock}
                            </span>
                            {product.stock <= product.minStock && (
                              <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-700 border-amber-200">
                                Baixo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.allowInstallments ? (
                            <div className="flex flex-col">
                              <span>Até {product.maxInstallments}x</span>
                              <span className="text-xs text-muted-foreground">
                                {product.installmentFee > 0 
                                  ? `${product.installmentFee}% de juros` 
                                  : "Sem juros"}
                              </span>
                            </div>
                          ) : (
                            <span>Não disponível</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                •••
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenProductForm(product)}>
                                Editar produto
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => confirmDelete(product.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                Excluir produto
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredProducts.length} de {products.length} produtos
            </p>
          </div>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={openProductForm} onOpenChange={setOpenProductForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Edite as informações do produto."
                : "Preencha as informações para cadastrar um novo produto."}
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            initialData={editingProduct} 
            onSubmit={handleAddEditProduct} 
            onCancel={() => setOpenProductForm(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Product Details Dialog */}
      <Dialog open={!!viewingProduct} onOpenChange={(open) => !open && setViewingProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <ProductDetails 
              product={viewingProduct} 
              onEdit={() => {
                setViewingProduct(null);
                handleOpenProductForm(viewingProduct);
              }}
              onClose={() => setViewingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
