export interface MenuTranslations {
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
  decValue: number;
}

export interface MenuItem extends MenuItemBase {
  description?: string;
  iconKey: string;
}
