function checkboxToHtml (elem, childrenHtml) {
	const {checked} = elem;
	const checkedAttr = checked ? 'checked' : '';

	return `<span data-w-e-type="checkbox"><input type="checkbox" disabled ${checkedAttr}>${childrenHtml}</span>`;
}

export const checkboxToHtmlConf = {
	type: 'checkbox',
	elemToHtml: checkboxToHtml,
};