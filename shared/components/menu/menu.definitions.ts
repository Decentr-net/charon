export interface MenuTranslations {
  comingSoon: string;
  pdv: string;
}

export interface MenuUserProfile {
  avatar: string;
  firstName: string;
  lastName: string;
}

interface MenuItemBase {
  action?: () => void;
}

export interface MenuUserItem extends MenuItemBase {
  firstName: string;
  lastName: string;
  pdvValue: string;
}

export interface MenuItem extends MenuItemBase {
  description?: string;
  iconKey: string;
  title: string;
}
