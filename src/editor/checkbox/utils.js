import $, {append, on, hide, click} from 'dom7';

if (hide) {
	$.fn.hide = hide;
}
if (append) {
	$.fn.append = append;
}
if (click) {
	$.fn.click = click;
}
if (on) {
	$.fn.on = on;
}

export {Dom7Array} from 'dom7';
export default $;
