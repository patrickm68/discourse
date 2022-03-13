import UserMenuNotificationsList from "discourse/components/user-menu/notifications-list";

export default class UserMenuMentionsNotificationsList extends UserMenuNotificationsList {
  get filterByType() {
    return "mentioned";
  }
}
