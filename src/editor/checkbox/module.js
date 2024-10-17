import {checkboxToHtmlConf} from './elem-to-html';
import {checkboxMenuConf} from './menu/index';
import {parseHtmlConf} from './parse-elem-html';
import {renderTodoConf} from './render-elem';
import withCheckbox from './plugins';

const Checkbox = {
	renderElems: [renderTodoConf],
	elemsToHtml: [checkboxToHtmlConf],
	parseElemsHtml: [parseHtmlConf],
	menus: [checkboxMenuConf],
	editorPlugin: withCheckbox,
};

export default Checkbox;