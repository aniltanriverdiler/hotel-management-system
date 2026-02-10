"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  ChevronDown,
  Menu,
  X,
  Layers,
  FileText,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: MenuItem[];
  hasDropdown?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    hasDropdown: true,
    children: [
      { id: "home", title: "Home", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
];

const allPageItems: MenuItem[] = [
  {
    id: "ecommerce",
    title: "Ecommerce",
    icon: ShoppingCart,
    hasDropdown: true,
    children: [
      {
        id: "add-product",
        title: "Add Product",
        icon: ShoppingCart,
        href: "/products/add",
      },
      {
        id: "product-list",
        title: "Product List",
        icon: ShoppingCart,
        href: "/products/list",
      },
    ],
  },
  {
    id: "category",
    title: "Category",
    icon: Layers,
    hasDropdown: true,
    children: [
      {
        id: "category-list",
        title: "Category List",
        icon: Layers,
        href: "/categories/list",
      },
      {
        id: "new-category",
        title: "New Category",
        icon: Layers,
        href: "/categories/new",
      },
    ],
  },

  {
    id: "order",
    title: "Order",
    icon: FileText,
    hasDropdown: true,
    children: [
      {
        id: "order-list",
        title: "Order List",
        icon: FileText,
        href: "/order/all",
      },
      {
        id: "order-detail",
        title: "Order Detail",
        icon: FileText,
        href: "/order/detail",
      },
    ],
  },
  {
    id: "user",
    title: "Add User",
    icon: Users,
    href: "/users",
  },

  {
    id: "gallery",
    title: "Gallery",
    icon: ImageIcon,
    href: "/gallery",
  },
];

const settingItems: MenuItem[] = [
  {
    id: "pages",
    title: "Pages",
    icon: FileText,
    hasDropdown: true,
    children: [
      {
        id: "list-page",
        title: "List Page",
        icon: FileText,
        href: "/pages/list",
      },
      { id: "new-page", title: "New Page", icon: FileText, href: "/pages/new" },
    ],
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  const toggleMenu = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? "" : menuId);
  };

  const MenuSection = ({
    title,
    items,
    titleColor = "text-gray-400",
  }: {
    title: string;
    items: MenuItem[];
    titleColor?: string;
  }) => (
    <div className="mb-6">
      <h3
        className={cn(
          "mb-4 px-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
          titleColor,
          isCollapsed ? "opacity-0" : "opacity-100"
        )}
      >
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <div key={item.id}>
            {item.hasDropdown && item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={cn(
                    "flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200",
                    "hover:bg-blue-50 hover:text-blue-600",
                    activeMenu === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700",
                    isCollapsed ? "justify-center px-2" : "justify-between"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 text-left">{item.title}</span>
                    )}
                  </div>
                  {!isCollapsed && item.hasDropdown && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeMenu === item.id ? "rotate-180" : ""
                      )}
                    />
                  )}
                </button>
                {!isCollapsed && activeMenu === item.id && (
                  <div className="mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href || "#"}
                        className="flex items-center px-4 py-2.5 ml-8 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-lg"
                      >
                        <child.icon className="h-4 w-4 mr-3" />
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href || "#"}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium transition-all duration-200",
                  "hover:bg-blue-50 hover:text-blue-600 text-gray-700",
                  isCollapsed ? "justify-center px-2" : ""
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon
                  className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")}
                />
                {!isCollapsed && item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => onToggle?.()}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white transition-all duration-300 ease-in-out",
          "shadow-sm border-r border-gray-100 flex flex-col",
          isCollapsed ? "w-16" : "w-72"
        )}
      >
        {/* Header - Remos Logo */}
        <div
          className={cn(
            "flex items-center px-6 py-5 border-b border-gray-100",
            isCollapsed ? "justify-center px-3" : "justify-start"
          )}
        >
          {!isCollapsed ? (
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/hotel-img.png"
                width={40}
                height={30}
                alt="StayEase"
                className="object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">StayEase</span>
            </Link>
          ) : (
            <Image
              src="/images/hotel-img.png"
              width={32}
              height={24}
              alt="StayEase"
              className="object-contain"
            />
          )}
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          {/* Main Home Section */}
          <MenuSection
            title="MAIN HOME"
            items={menuItems}
            titleColor="text-gray-400"
          />

          {/* All Page Section */}
          <MenuSection
            title="ALL PAGE"
            items={allPageItems}
            titleColor="text-gray-400"
          />

          {/* Setting Section */}
          <MenuSection
            title="SETTING"
            items={settingItems}
            titleColor="text-gray-400"
          />
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button
          onClick={onToggle}
          className={cn(
            "lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200",
            "hover:bg-gray-50 transition-colors"
          )}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-gray-600" />
          ) : (
            <X className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
