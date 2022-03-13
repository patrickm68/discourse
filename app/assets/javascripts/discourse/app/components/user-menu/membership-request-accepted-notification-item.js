import UserMenuDefaultNotificationItem from "discourse/components/user-menu/default-notification-item";
import { groupPath } from "discourse/lib/url";

export default class UserMenuMembershipRequestAcceptedNotificationItem extends UserMenuDefaultNotificationItem {
  get url() {
    return groupPath(this.data.group_name);
  }
}
