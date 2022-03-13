import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import { userPath } from "discourse/lib/url";

export default class UserMenuMembershipRequestConsolidatedNotificationItem extends UserMenuDefaultNotificationItem {
  get url() {
    return userPath(
      `${this.args.notification.username || this.currentUser.username}/messages`
    );
  }

  get count() {
    return this.data.count;
  }
}
