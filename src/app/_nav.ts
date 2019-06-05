interface NavAttributes {
  [propName: string]: any;
}

interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}

interface NavBadge {
  text: string;
  variant: string;
}

interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   icon: 'icon-speedometer',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  {
    title: true,
    name: 'Admin'
  },
  {
    name: 'Import data',
    url: '/migrate',
    icon: 'fa fa-download'
  },
  {
    title: true,
    name: 'Resource Management'
  },
  {
    name: 'RDB',
    url: '/resources/search',
    icon: 'fa fa-address-book'
  },
  {
    name: 'Tracking test',
    url: '/resources/test-waiting/list',
    icon: 'fa fa-minus-square-o'
  },
  {
    title: true,
    name: 'Production'
  },
  {
    name: 'Production list',
    url: '/projects',
    icon: 'fa fa-list-ol'
  },
  {
    name: 'Purchase orders',
    url: '/purchaseOrders',
    icon: 'fa fa-file-o'
  },
  {
    name: 'Invoices',
    url: '/invoices',
    icon: 'fa fa-money'
  },
  {
    title: true,
    name: 'Account'
  },
  {
    name: 'Setting',
    url: '/account/user-setting',
    icon: 'fa fa-cog'
  },
];
