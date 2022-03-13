import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import { userPath } from "discourse/lib/url";

export default class UserMenuInviteeAcceptedNotificationItem extends UserMenuDefaultNotificationItem {
  get url() {
    return userPath(this.data.display_username);
  }
}
