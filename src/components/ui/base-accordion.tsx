"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  value: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface BaseAccordionProps {
  items: AccordionItemData[];
  defaultValue?: string[];
  className?: string;
}

export function BaseAccordionGroup({
  items,
  defaultValue = [items[0]?.value],
  className,
}: BaseAccordionProps) {
  return (
    <BaseAccordion.Root
      defaultValue={defaultValue}
      className={cn("divide-y divide-slate-200/80 dark:divide-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden", className)}
    >
      {items.map((item) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          className="group"
        >
          <BaseAccordion.Header>
            <BaseAccordion.Trigger className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group-data-[open]:text-blue-600 dark:group-data-[open]:text-blue-400">
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.title}</span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[open]:rotate-180 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100/50 dark:border-slate-800/50 bg-slate-50/40 dark:bg-slate-900/40">
            {item.content}
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}
