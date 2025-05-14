
import React from "react";
import { ShoppingBag, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProductsPage = () => {
  return (
    <div className="p-6">
      <PageTitle
        title="Produtos"
        subtitle="Gerencie uniformes e produtos da escola de dança"
        icon={ShoppingBag}
      >
        <Button className="bg-dance-primary hover:bg-dance-secondary">
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </PageTitle>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Cadastre seu primeiro produto para começar.
            </p>
            <Button className="bg-dance-primary hover:bg-dance-secondary">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Produto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
