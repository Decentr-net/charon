export interface MenuTranslations {
  comingSoon: string;
  lock: string;
  myAccounts: string;
  pdv: string;
}

export interface MenuUserProfile {
  avatar: string;
  firstName: string;
  lastName: string;
}

interface MenuLinkBase {
  link?: string;
  title: string;
}

export interface MenuUserLink extends Required<MenuLinkBase> {
  pdvValue: string;
}

export interface MenuLink extends MenuLinkBase {
  blank?: boolean;
  iconKey: string;
}
