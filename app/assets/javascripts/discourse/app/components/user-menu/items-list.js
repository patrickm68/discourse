import GlimmerComponent from "discourse/components/glimmer";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import I18n from "I18n";

export default class UserMenuItemsList extends GlimmerComponent {
  @tracked loading = false;
  @tracked items = [];

  constructor() {
    super(...arguments);
    this._load();
  }

  get showAll() {
    return false;
  }

  get showAllHref() {
    throw new Error(
      `the showAllHref getter must be implemented in ${this.constructor.name}`
    );
  }

  get showAllTitle() {}

  get showDismiss() {
    return false;
  }

  get dismissTitle() {}

  fetchItems() {
    throw new Error(
      `the fetchItems method must be implemented in ${this.constructor.name}`
    );
  }

  _load() {
    this.loading = true;
    this.fetchItems()
      .then((items) => {
        const valid = items.every((item) => {
          if (!item.userMenuComponent) {
            console.error("userMenuComponent property is blank on", item);
            return false;
          }
          return true;
        });
        if (!valid) {
          throw new Error("userMenuComponent must be present on all items");
        }
        this.items = items;
      })
      .finally(() => (this.loading = false));
  }

  @action
  dismissButtonClick() {
    // TODO do something
    console.log("do something");
  }
}
