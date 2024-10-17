import {
	DomEditor, SlateEditor as Editor
} from '@wangeditor-next/editor';


class CheckboxMenu {
	constructor () {
		this.title = '插入复选框'; // 这里需要翻译时自行替换 t 函数
		this.iconSvg = '<svg viewBox="0 0 1024 1024"><path d="M278.755556 403.911111l-79.644445 79.644445L455.111111 739.555556l568.888889-568.888889-79.644444-79.644445L455.111111 580.266667l-176.355555-176.355556zM910.222222 910.222222H113.777778V113.777778h568.888889V0H113.777778C51.2 0 0 51.2 0 113.777778v796.444444c0 62.577778 51.2 113.777778 113.777778 113.777778h796.444444c62.577778 0 113.777778-51.2 113.777778-113.777778V455.111111h-113.777778v455.111111z"></path></svg>';
		this.tag = 'button';
	}

	getValue () {
		// 无需获取 val
		return '';
	}

	isActive () {
		return false;
	}

	isDisabled (editor) {
		if (editor.selection == null) {
			return true;
		}

		const selectedElems = DomEditor.getSelectedElems(editor);
		const notMatch = selectedElems.some((elem) => {
			if (Editor.isVoid(editor, elem) && Editor.isBlock(editor, elem)) {
				return true;
			}

			const {type} = elem;

			if (['pre', 'table', 'list-item'].includes(type)) {
				return true;
			}
			return false;
		});

		if (notMatch) {
			return true;
		}

		return false;
	}

	exec (editor) {
		// if (!editor.selection) {
		// 	return;
		// }
		//
		// Transforms.insertNodes(editor, {
		// 	type: 'checkbox',
		// 	checked: false,
		// 	children: [{text: ''}],
		// });

		// 还原选区
		editor.restoreSelection();

		// 插入节点
		const attachmentElem = {
			type: 'checkbox',
			children: [{text: ''}],
		};
		editor.insertNode(attachmentElem);
		editor.move(1);

	}
}

export default CheckboxMenu;