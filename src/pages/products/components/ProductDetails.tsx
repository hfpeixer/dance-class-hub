
import React from "react";
import { Button } from "@/components/ui/button";
import { Product } from "../hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Package,
  Tag,
  DollarSign,
  ShoppingCart,
  Calendar,
  Edit,
  Truck,
  Info,
  CreditCard,
} from "lucide-react";

type ProductDetailsProps = {
  product: Product;
  onEdit: () => void;
  onClose: () => void;
};

export const ProductDetails = ({ product, onEdit, onClose }: ProductDetailsProps) => {
  // Format price to Brazilian Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Format date to Brazilian format (dd/mm/yyyy)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Calculate installment price
  const calculateInstallment = (price: number, installments: number, fee: number) => {
    if (installments <= 0) return 0;
    
    if (fee === 0) {
      // Without interest
      return price / installments;
    } else {
      // With interest (simple interest calculation)
      const totalPrice = price * (1 + (fee / 100));
      return totalPrice / installments;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{product.category}</Badge>
            {product.sku && (
              <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              Informações Básicas
            </h4>
            
            <div className="bg-muted/50 p-3 rounded-md">
              {product.description && (
                <p className="text-sm mb-2">{product.description}</p>
              )}
              {!product.description && (
                <p className="text-sm text-muted-foreground mb-2">Sem descrição disponível</p>
              )}
            </div>
            
            <div className="flex items-center justify-between p-2 border-b">
              <span className="text-sm text-muted-foreground">Preço de venda:</span> 
              <span className="font-medium">{formatCurrency(product.price)}</span>
            </div>
            
            {product.cost !== undefined && (
              <div className="flex items-center justify-between p-2 border-b">
                <span className="text-sm text-muted-foreground">Custo:</span> 
                <span>{formatCurrency(product.cost)}</span>
              </div>
            )}
            
            {product.cost !== undefined && product.cost > 0 && (
              <div className="flex items-center justify-between p-2 border-b">
                <span className="text-sm text-muted-foreground">Margem:</span> 
                <span>
                  {(((product.price - product.cost) / product.price) * 100).toFixed(2)}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
              Estoque
            </h4>
            
            <div className="flex items-center justify-between p-2 border-b">
              <span className="text-sm text-muted-foreground">Quantidade atual:</span> 
              <span className={product.stock > product.minStock ? "text-green-600" : "text-red-600"}>
                {product.stock} unidades
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 border-b">
              <span className="text-sm text-muted-foreground">Estoque mínimo:</span> 
              <span>{product.minStock} unidades</span>
            </div>
            
            <div className="flex items-center justify-between p-2">
              <span className="text-sm text-muted-foreground">Status:</span> 
              <Badge 
                variant="outline" 
                className={
                  product.stock === 0
                    ? "border-red-500 bg-red-500/10 text-red-700"
                    : product.stock <= product.minStock
                      ? "border-amber-500 bg-amber-500/10 text-amber-700"
                      : "border-green-500 bg-green-500/10 text-green-700"
                }
              >
                {product.stock === 0 ? "Sem estoque" : 
                  product.stock <= product.minStock ? "Estoque baixo" : "Em estoque"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              Opções de Pagamento
            </h4>
            
            {product.allowInstallments ? (
              <>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Parcelamento em até {product.maxInstallments}x</p>
                  <p className="text-xs text-muted-foreground">
                    {product.installmentFee > 0 
                      ? `Com juros de ${product.installmentFee}% ao mês` 
                      : "Sem juros"}
                  </p>
                </div>
                
                <div className="space-y-1">
                  {Array.from({ length: product.maxInstallments }, (_, i) => i + 1).map((installment) => (
                    <div key={installment} className="flex items-center justify-between p-2 border-b text-sm">
                      <span>{installment}x de:</span> 
                      <span>
                        {formatCurrency(calculateInstallment(
                          product.price, 
                          installment, 
                          installment === 1 ? 0 : product.installmentFee
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm">Parcelamento não disponível para este produto.</p>
                <p className="text-xs text-muted-foreground">
                  Pagamento somente à vista: {formatCurrency(product.price)}
                </p>
              </div>
            )}
          </div>

          {(product.supplier || product.supplierContact) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                Fornecedor
              </h4>
              
              <div className="bg-muted/50 p-3 rounded-md">
                {product.supplier && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Nome:</span> {product.supplier}
                  </p>
                )}
                {product.supplierContact && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Contato:</span> {product.supplierContact}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              Datas
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {product.dateAdded && (
                <div className="p-2 border-b">
                  <p className="text-xs text-muted-foreground">Adicionado em:</p>
                  <p className="text-sm">{formatDate(product.dateAdded)}</p>
                </div>
              )}
              
              {product.lastUpdated && (
                <div className="p-2 border-b">
                  <p className="text-xs text-muted-foreground">Última atualização:</p>
                  <p className="text-sm">{formatDate(product.lastUpdated)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button 
          onClick={onEdit}
          className="bg-dance-primary hover:bg-dance-secondary"
        >
          <Edit className="h-4 w-4 mr-2" /> Editar
        </Button>
      </DialogFooter>
    </div>
  );
};
