import vue from "vue";

import JsonView from "./JsonView.vue";
import ArrayView from "./ArrayView.vue";
import JsonEditor from "./JsonEditor.vue";

Array.prototype.rmIndex = function (index) {
  this.splice(index, 1)
  return this
}

vue.component("JsonView", JsonView);
vue.component("ArrayView", ArrayView);
vue.component("JsonEditor", JsonEditor);


export default JsonEditor;
