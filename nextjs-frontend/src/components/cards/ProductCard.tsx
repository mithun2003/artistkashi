import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type ProductCardProps = {
  title: string;
  price?: string | number;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export function ProductCard({ title, price, children, footer }: ProductCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <div className="flex items-baseline justify-between gap-4">
          <CardTitle className="uppercase tracking-[0.08em]">{title}</CardTitle>
          {price && <div className="text-sm font-medium">${price}</div>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

export default ProductCard;
