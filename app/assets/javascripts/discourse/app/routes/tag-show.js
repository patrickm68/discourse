import {
  filterQueryParams,
  findTopicList,
} from "discourse/routes/build-topic-route";
import {
  changeSort,
  queryParams,
  resetParams,
} from "discourse/controllers/discovery-sortable";
import Category from "discourse/models/category";
import Composer from "discourse/models/composer";
import DiscourseRoute from "discourse/routes/discourse";
import FilterModeMixin from "discourse/mixins/filter-mode";
import I18n from "I18n";
import PermissionType from "discourse/models/permission-type";
import { escapeExpression } from "discourse/lib/utilities";
import { makeArray } from "discourse-common/lib/helpers";
import { setTopicList } from "discourse/lib/topic-list-tracker";
import { scrollTop } from "discourse/mixins/scroll-top";
import showModal from "discourse/lib/show-modal";
import { action } from "@ember/object";

export default DiscourseRoute.extend(FilterModeMixin, {
  navMode: "latest",
  queryParams,
  controllerName: "discovery/latest",

  async model(params, transition) {
    const tag = this.store.createRecord("tag", {
      id: escapeExpression(params.tag_id),
    });

    let additionalTags;

    if (params.additional_tags) {
      additionalTags = params.additional_tags.split("/").map((t) => {
        return this.store.createRecord("tag", {
          id: escapeExpression(t),
        }).id;
      });
    }

    const filterType = this.navMode.split("/")[0];

    let tagNotification;
    if (tag && tag.id !== "none" && this.currentUser) {
      // If logged in, we should get the tag's user settings
      tagNotification = await this.store.find(
        "tagNotification",
        tag.id.toLowerCase()
      );
    }

    const category = params.category_slug_path_with_id
      ? Category.findBySlugPathWithID(params.category_slug_path_with_id)
      : null;
    const filteredQueryParams = filterQueryParams(
      transition.to.queryParams,
      {}
    );
    const topicFilter = this.navMode;
    const tagId = tag ? tag.id.toLowerCase() : "none";
    let filter;

    if (category) {
      category.setupGroupsAndPermissions();
      filter = `tags/c/${Category.slugFor(category)}/${category.id}`;

      if (this.noSubcategories !== undefined) {
        filter += this.noSubcategories ? "/none" : "/all";
      }

      filter += `/${tagId}/l/${topicFilter}`;
    } else if (additionalTags) {
      filter = `tags/intersection/${tagId}/${additionalTags.join("/")}`;
    } else {
      filter = `tag/${tagId}/l/${topicFilter}`;
    }

    const list = await findTopicList(
      this.store,
      this.topicTrackingState,
      filter,
      filteredQueryParams,
      {
        cached: this.isPoppedState(transition),
      }
    );

    if (list.topic_list.tags && list.topic_list.tags.length === 1) {
      // Update name of tag (case might be different)
      tag.setProperties({
        id: list.topic_list.tags[0].name,
        staff: list.topic_list.tags[0].staff,
      });
    }

    setTopicList(list);

    return {
      tag,
      category,
      list,
      additionalTags,
      filterType,
      tagNotification,
      canCreateTopic: list.can_create_topic,
      canCreateTopicOnCategory: category?.permission === PermissionType.FULL,
      canCreateTopicOnTag: !tag.staff || this.currentUser?.staff,
    };
  },

  setupController(controller, model) {
    const noSubcategories =
      this.noSubcategories === undefined
        ? model.category?.default_list_filter === "none"
        : this.noSubcategories;

    this.controllerFor("tag.show").setProperties({
      model: model.tag,
      ...model,
    });

    this.setProperties({
      navMode: this.navMode,
      noSubcategories,
      loading: false,
      period: model.list.for_period,
    });

    let topicOpts = {
      model: this.context.list,
      category: this.category,
      period:
        this.context.list.get("for_period") ||
        (model.modelParams && model.modelParams.period),
      selected: [],
      noSubcategories: this.params && !!this.context.params.no_subcategories,
      expandAllPinned: true,
      canCreateTopic: this.canCreateTopic,
      canCreateTopicOnCategory: this.canCreateTopicOnCategory,
      tag: this.context.tag,
    };

    this.controllerFor("discovery/topics").setProperties(topicOpts);
    this.controllerFor("navigation/tag").setProperties({
      filterType: this.context.filterType,
      canCreateTopic: this.context.canCreateTopic,
      noSubcategories: this.context.noSubcategories,
      tagNotification: this.context.tagNotification,
      additionalTags: this.context.additionalTags,
      showInfo: this.context.showInfo,
      canCreateTopicOnTag: this.context.canCreateTopicOnTag,
      category: this.context.category,
      tag: this.context.tag,
    });

    this.searchService.set("searchContext", model.tag.searchContext);
  },
  titleToken() {
    const filterText = I18n.t(
      `filters.${this.navMode.replace("/", ".")}.title`
    );
    const controller = this.controllerFor("tag.show");

    if (controller.tag?.id) {
      if (controller.category) {
        return I18n.t("tagging.filters.with_category", {
          filter: filterText,
          tag: controller.tag.id,
          category: controller.category.name,
        });
      } else {
        return I18n.t("tagging.filters.without_category", {
          filter: filterText,
          tag: controller.tag.id,
        });
      }
    } else {
      if (controller.category) {
        return I18n.t("tagging.filters.untagged_with_category", {
          filter: filterText,
          category: controller.category.name,
        });
      } else {
        return I18n.t("tagging.filters.untagged_without_category", {
          filter: filterText,
        });
      }
    }
  },

  renderTemplate() {
    this.render("discovery");
    this.render("navigation/tag", {
      into: "discovery",
      outlet: "navigation-bar",
    });
    this.render("discovery/topics", {
      into: "discovery",
      outlet: "list-container",
    });
  },

  deactivate() {
    this._super(...arguments);
    this.searchService.set("searchContext", null);
  },

  @action
  renameTag(tag) {
    showModal("rename-tag", { model: tag });
  },

  @action
  changeSort(sortBy) {
    changeSort.call(this, sortBy);
  },

  @action
  createTopic() {
    if (this.currentUser?.has_topic_draft) {
      this.openTopicDraft();
    } else {
      const controller = this.controllerFor("tag.show");
      const composerController = this.controllerFor("composer");
      composerController
        .open({
          categoryId: controller.category?.id,
          action: Composer.CREATE_TOPIC,
          draftKey: Composer.NEW_TOPIC_KEY,
        })
        .then(() => {
          // Pre-fill the tags input field
          if (composerController.canEditTags && controller.tag?.id) {
            const composerModel = this.controllerFor("composer").model;
            composerModel.set(
              "tags",
              [
                controller.get("model.id"),
                ...makeArray(controller.additionalTags),
              ].filter(Boolean)
            );
          }
        });
    }
  },

  @action
  dismissReadTopics(dismissTopics) {
    const operationType = dismissTopics ? "topics" : "posts";
    this.send("dismissRead", operationType);
  },

  @action
  dismissRead(operationType) {
    const controller = this.controllerFor("discovery/topics");
    controller.send("dismissRead", operationType, {
      categoryId: controller.get("category.id"),
      includeSubcategories: !controller.noSubcategories,
    });
  },

  @action
  loadingComplete() {
    this.controllerFor("discovery").loadingComplete();
    if (!this.session.get("topicListScrollPosition")) {
      scrollTop();
    }
    this.set("loading", false);
    // need to fix for new topic dismissal

    return true;
  },

  @action
  resetParams(skipParams = []) {
    resetParams.call(this, skipParams);
  },
});
