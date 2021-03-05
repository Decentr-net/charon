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
  title: string;
}

export interface MenuUserItem extends MenuItemBase {
  pdvValue: string;
}

export interface MenuItem extends MenuItemBase {
  iconKey: string;
}
