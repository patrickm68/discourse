import RestModel from "discourse/models/rest";
import discourseComputed from "discourse-common/utils/decorators";

function coreComponentForType() {
  return {
    granted_badge: "user-menu/granted-badge-notification-item",
    liked: "user-menu/liked-notification-item",
    liked_consolidated: "user-menu/liked-consolidated-notification-item",
    bookmark_reminder: "user-menu/bookmark-reminder-notification-item",
    custom: "user-menu/custom-notification-item",
    group_message_summary: "user-menu/group-message-summary-notification-item",
    invitee_accepted: "user-menu/invitee-accepted-notification-item",
    membership_request_accepted:
      "user-menu/membership-request-accepted-notification-item",
  };
}

const DefaultItem = "user-menu/default-notification-item";
let _componentForType = coreComponentForType();

export function registerCustomComponentForType(notificationType, component) {
  _componentForType[notificationType] = component;
}

export function resetComponentForType() {
  _componentForType = coreComponentForType();
}

export default RestModel.extend({
  @discourseComputed("notification_type")
  userMenuComponent(notificationType) {
    const component =
      _componentForType[this.site.notificationLookup[notificationType]];
    return component || DefaultItem;
  },
});
