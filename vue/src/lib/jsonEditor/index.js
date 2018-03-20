import JsonEditor from './JsonEditor.vue'
import JsonView from './JsonView.vue'
import ArrayView from './ArrayView.vue'

const VERSION = "1.5.1"


const install = (Vue) => {
  if (install.installed) return

  Vue.component('JsonEditor', JsonEditor)
  Vue.component('json-view', JsonView)
  Vue.component('array-view', ArrayView)

  Array.prototype.rmIndex = function (index) {
	  this.splice(index, 1)
	  return this
	}
}

export default install

export const components = {
  JsonEditor,
  VERSION
}

