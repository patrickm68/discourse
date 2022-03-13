import UserMenuItemsList from "discourse/components/user-menu/items-list";
import I18n from "I18n";
import { ajax } from "discourse/lib/ajax";
import getUrl from "discourse-common/lib/get-url";

const DefaultComponent = "user-menu/default-reviewable-item";
function defaultItemComponents() {
  return {
    ReviewableFlaggedPost: "user-menu/reviewable-flagged-post-item",
    ReviewableQueuedPost: "user-menu/reviewable-queued-post-item",
    ReviewableUser: "user-menu/reviewable-user-item",
  };
}

let _itemComponents = defaultItemComponents();

export default class UserMenuReviewablesList extends UserMenuItemsList {
  get showAll() {
    return true;
  }

  get showAllHref() {
    return getUrl("/review");
  }

  get showAllTitle() {
    return I18n.t("user_menu.reviewable.view_all");
  }

  fetchItems() {
    return ajax("/review/lightweight-list").then((data) => {
      return data.reviewables.map((item) => {
        const type = item.type;
        delete item.type;
        item.userMenuComponent = _itemComponents[type] || DefaultComponent;
        return item;
      });
    });
  }
}
