import {h} from 'snabbdom';
import {Transforms} from 'slate';
import {
	DomEditor
} from '@wangeditor-next/editor';

/**
 * render todo elem
 * @param elemNode slate elem
 * @param children children
 * @param editor editor
 * @returns vnode
 */
function renderCheckbox (elemNode, children, editor) {
	// 判断 disabled
	let disabled = false;

	if (editor.isDisabled()) {
		disabled = true;
	}

	const {checked} = elemNode;
	return h('span', {style: {margin: '5px 0'}, attrs: {contenteditable: 'false'}, }, [
		h('span', {
			attrs: {contenteditable: 'false'},
			style: {marginRight: '0.5em'},
		}, [
			h('input', {
				attrs: {
					type: 'checkbox',
					checked: checked,
					disabled: disabled,
				},
				on: {
					change: (event) => {
						const path = DomEditor.findPath(editor, elemNode);
						console.log(path)
						const newProps = {
							checked: event.target.checked,
						};
						Transforms.setNodes(editor, newProps, {at: path});
					},
				},
			}, [])
		]),
		h('span', {}, children)
	]);
}

const renderTodoConf = {
	type: 'checkbox', // 和 elemNode.type 一致
	renderElem: renderCheckbox,
};

export {renderTodoConf};