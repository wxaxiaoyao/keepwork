
import _Tag from "./tag.js";
import _tags from "./tags.js";

export const Tag = _Tag;
export const tags = _tags;
export const tagFactory = function(tagName) {
	return tags.getTag(tagName);
}

export default tags;
