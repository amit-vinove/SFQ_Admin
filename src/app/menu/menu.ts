import { CoreMenu } from "@core/types";

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "",
    type: "collapsible",

    icon: "home",

    children: [
      {
        id: "analytics",
        title: "Analytics",
        translate: "Analytics",
        type: "item",
     
        icon: "circle",
        url: "dashboard/analytics",
      },
    ],
  },
  // Apps & Pages
  {
    id: "apps",
    type: "section",
    title: "Apps & Pages",
    translate: "Apps & Pages",
    icon: "package",
    children: [
      {
        id: "users",
        title: "User",
        translate: "User Management",
        type: "item",
        icon: "users",
        url: "apps/user/user-list",
      },
      {
        id: "foodSupplier",
        title: "Food Supplier",
        translate: "Food Supplier",
        type: "collapsible",

        icon: "user-plus",

        children: [
          {
            id: "supplier",
            title: "Food Supplier Confirmation",
            translate: "Food Supplie Confirmationr",
            type: "item",
            icon: "circle",
            url: "apps/supplier/food-supplier"
          },
          {
            id: "supplierData",
            title: "Food Supplier Management",
            translate: "Food Supplier Management",
            type: "item",
            icon: "circle",
            url: "apps/supplier/food-supplier-management"
          },
          {
            id: "confirmation",
            title: "Confirmation",
            translate: "Confirmation",
            type: "item",
            icon: "circle",
            url: "apps/supplier/confirmation"
          }
        ]
       
      },
       {
        id: "reports",
        title: "reports",
        translate: "Reports",
        type: "item",
        icon: "file",
         url: "apps/reports/reports",
      },
    
      {
        id: "subscription",
        title: "Subscription",
        translate: "Subscription Management",
        type: "item",
        icon: "credit-card",
        url: "apps/subscription/subscription",
      },
      {
        id: "faq",
        title: "faq",
        translate: "FAQ Management",
        type: "item",
        icon: "help-circle",
        url: "apps/faq/faq",
      },
      {
        id: "account-settings",
        title: "Account Settings",
        translate: "Account Settings",
        type: "item",
        icon: "settings",
        url: "pages/account-settings",
      },

      {
        id: "logout",
        title: "logout",
        translate: "Logout",
        type: "item",
        icon: "log-out",
        url: "auth/login",
      },
    ],
  },
];
