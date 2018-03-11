
import styles from "./test.styles.js";

export default {
	render: function(block, h) {
		var style = styles[block.modParams.style || "default"];
		
		return style(h);

	}
}
