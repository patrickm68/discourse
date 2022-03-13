import UserMenuNotificationsList from "discourse/components/user-menu/notifications-list";

export default class UserMenuBadgesNotificationsList extends UserMenuNotificationsList {
  get filterByType() {
    return "granted_badge";
  }
}
