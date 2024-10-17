import {Text} from 'slate';

import $ from './utils';

function parseHtml (elem, children, editor) {
	const $elem = $(elem);

	children = children.filter((child) => {
		if (Text.isText(child)) {
			return true;
		}
		if (editor.isInline(child)) {
			return true;
		}
		return false;
	});

	// 无 children ，则用纯文本
	if (children.length === 0) {
		children = [{text: $elem.text().replace(/\s+/gm, ' ')}];
	}

	// 获取 checked
	let checked = false;
	const $input = $elem.find('input[type="checkbox"]');

	if ($input.attr('checked') != null) {
		checked = true;
	}

	return {
		type: 'checkbox',
		checked,
		// @ts-ignore
		children,
	};
}

export const parseHtmlConf = {
	selector: 'span[data-w-e-type="checkbox"]',
	parseElemHtml: parseHtml,
};