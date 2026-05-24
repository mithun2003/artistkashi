import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type CourseCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export function CourseCard({ title, subtitle, children, footer }: CourseCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="uppercase tracking-[0.08em]">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

export default CourseCard;
