export interface MenuTranslations {
  comingSoon: string;
  pdv: string;
}

export interface MenuUserProfile {
  avatar: string;
  title: string;
}

interface MenuItemBase {
  action?: () => void;
  title: string;
}

export interface MenuUserItem extends MenuItemBase {
  pdvValue: string;
}

export interface MenuItem extends MenuItemBase {
  description?: string;
  iconKey: string;
}
