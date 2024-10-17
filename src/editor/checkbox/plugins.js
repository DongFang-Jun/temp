import {DomEditor, } from '@wangeditor-next/editor';

export default function withCheckbox (editor) {
	const {isInline} = editor;
	const newEditor = editor;

	// 重写 isInline
	newEditor.isInline = (elem) => {
		const type = DomEditor.getNodeType(elem);

		if (['todo', 'checkbox'].includes(type)) {
			return true;
		}

		return isInline(elem);
	};

	// 返回 editor ，重要！
	return newEditor;
}

