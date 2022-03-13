import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import { formatUsername } from "discourse/lib/utilities";

export default class UserMenuLikedNotificationItem extends UserMenuDefaultNotificationItem {
  get count() {
    return this.data.count;
  }

  get countMinus2() {
    return this.count - 2;
  }

  get username2() {
    return formatUsername(this.data.username2);
  }
}
