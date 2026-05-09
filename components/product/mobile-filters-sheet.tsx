"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "./product-filters";

interface MobileFiltersSheetProps {
  brands: string[];
  label: string;
}

export function MobileFiltersSheet({ brands, label }: MobileFiltersSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          {label}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <ProductFilters brands={brands} />
      </SheetContent>
    </Sheet>
  );
}
