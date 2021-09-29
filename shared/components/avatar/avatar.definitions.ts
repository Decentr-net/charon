import { environment } from '../../../environments/environment';

export const USER_AVATARS = [];

for (let i = 1; i <= 12; i++) {
  USER_AVATARS.push(`${environment.avatars}/user-avatar-${i}.svg`);
}
