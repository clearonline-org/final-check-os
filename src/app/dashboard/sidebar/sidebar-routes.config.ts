import { RouteInfo } from './sidebar.metadata';

export const ROUTES_DEP: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
    { path: 'user', title: 'User Profile', icon: 'person', class: '' },
    { path: 'table', title: 'Table List', icon: 'content_paste', class: '' },
    { path: 'typography', title: 'Typography', icon: 'library_books', class: '' },
    { path: 'icons', title: 'Icons', icon: 'bubble_chart', class: '' },
    { path: 'maps', title: 'Maps', icon: 'location_on', class: '' },
    { path: 'notifications', title: 'Notifications', icon: 'notifications', class: '' },
    { path: 'upgrade', title: 'Upgrade to PRO', icon: 'unarchive', class: 'active-pro' },
];

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard/applications', title: 'Applications', icon: 'dashboard', class: '' },
    { path: '/profile/logout', title: 'Logout', icon: 'clear', class: 'bottom-link' }
    // { path: 'upgrade', title: 'Upgrade to PRO', icon: 'unarchive', class: 'active-pro' },
];
