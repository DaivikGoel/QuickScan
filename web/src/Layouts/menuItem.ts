import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Catalog',
    icon: { name: 'home' },
    link: { to: '/dashboard' },
  },
  {
    title: 'Your Models',
    icon: { name: 'star-outline' },
    link: { to: '/edit' },
  },
];

export default items;
