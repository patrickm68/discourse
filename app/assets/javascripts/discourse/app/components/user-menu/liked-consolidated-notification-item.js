import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import { userPath } from "discourse/lib/url";

export default class UserMenuLikedConsolidatedNotificationItem extends UserMenuDefaultNotificationItem {
  get url() {
    return userPath(
      `${
        this.args.item.username || this.currentUser.username
      }/notifications/likes-received?acting_username=${this.data.username}`
    );
  }
}
