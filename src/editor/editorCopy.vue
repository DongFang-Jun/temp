<template>
  <bk-view class="editor" :style="{width:`${width}px`}">
    <bk-view class="custom-fields">
      <bk-view class="custom-fields-item" @click="!disabled? onInsertCustomField(item):''"
               v-for="item in customFieldList"
               :key="item.langCode">
        <bk-icon :icon="item.icon" style="font-size:16px;color:#939393"></bk-icon>
        <bk-lang :code="item.langCode"></bk-lang>
      </bk-view>
    </bk-view>
    <div class="editor-box" id="wangeditor">
      <div class="wangeditor-box" ref="editorElem"></div>
    </div>
  </bk-view>
</template>

<script>
	import E from 'wangeditor';

	const {BtnMenu} = E;

	export default {
		name: 'bkEditor',

		props: {
			width: {
				type: Number,
				default: 800
			},
			disabled: {
				type: Boolean,
				default: false
			},
			defaultValue: {
				type: String,
				default: ''
			},
			customFieldList: {
				type: Array,
				default: () => {
					return [];
				}
			},
			autoRefresh: {
				type: Boolean,
				default: true
			}, // 富文本编辑器更新是否抛出事件
			autoBubbleCustomField: {
				type: Boolean,
				default: true
			}, // 插入自定义字段是否抛出事件
		},

		watch: {
			disabled: {
				handler (newVal) {
					this.initEditorEnable();
					this.initEditor();
				},
			}
		},

		data () {
			return {
				editor: null
			};
		},

		mounted () {
			this.initEditor();
		},

		methods: {
			// 插入自定义字段
			onInsertCustomField (e) {
				const value = this.$bk_getTextWithLangCode(e.langCode);
				this.editor.txt.append(`<span style="color:#4D46F9;font-size:14px">#${value}#</span>`);
				this.editor.txt.append('<span style="color:rgba(0, 0, 0, 0.85);font-size:14px">&nbsp;</span>');
				this.changeEditorContent();
				if (this.autoBubbleCustomField) {
					const content = this.editor.txt.html();
					this.$emit('insetCustomFiled', content);
				}
			},

			// editor内容变更
			changeEditorContent (content = '') {
				if (this.autoRefresh) {
					content = content || this.editor.txt.html();
					this.$emit('updateContent', {content});
				}
			},

			// 控制富文本是否可编辑
			initEditorEnable () {
				if (!this.disabled) {
					this.editor.enable();
				} else {
					this.editor.disable();
				}
			},

			// 初始化富文本
			initEditor () {
				if (this.editor) {
					this.editor.destroy();
					this.editor = null;
				}
				this.editor = new E(this.$refs.editorElem); //获取组件并构造编辑器

				const _this = this;
				// 注册自定义菜单-复选框
				this.editor.menus.extend('checkbox', class AlertMenu extends BtnMenu {
					constructor (editor) {
						const $elem = E.$(`<div class="w-e-menu" data-title="复选框">
            <input type="checkbox" readonly :checked="false"/>
            </div>`);
						super($elem, editor);
						// 绑定点击事件，阻止复选框的默认行为
						$elem.on('click', (e) => {
							e.preventDefault(); // 阻止默认行为
						});
					}

					// 菜单点击事件
					clickHandler () {
						const nodeElem = document.createElement('input');
						nodeElem.setAttribute('type', 'checkbox');
						// 监听新增的checkbox
						nodeElem.addEventListener('change', (e) => {
							if (e.target.checked) {
								nodeElem.setAttribute('checked', 'true');
							} else {
								nodeElem.removeAttribute('checked');
							}
						});
						this.editor.cmd.do(
							'insertElem',
							{elems: [nodeElem]}
						);
						_this.changeEditorContent();
					}

					tryChangeActive () {
						// 激活菜单
						// 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
						// 2. this.this.isActive === true
						this.active();

						// // 取消激活菜单
						// // 1. 菜单 DOM 节点会删掉 .w-e-active
						// // 2. this.this.isActive === false
						// this.unActive()
					}
				});

				// 注册菜单
				this.editor.config.menus = ['head', 'bold', 'fontSize', 'fontName', 'foreColor', 'checkbox', 'italic', 'underline', 'strikeThrough', 'indent', 'lineHeight', 'backColor', 'splitLine', 'undo', 'justify', 'redo', 'table', 'image'];
				this.editor.config.menuTooltipPosition = 'up';
				this.editor.config.height = 600;

				this.editor.config.uploadImgServer = '/upload'; // 设置上传图片的地址
				this.editor.config.showLinkImg = false; // 隐藏网络图片tab
				// this.editor.config.uploadImgMaxLength = 1; //上传图片最大数
				// this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; //上传图片的最大值
				//封装上传图片方法
				this.editor.config.customUploadImg = (files, insert) => {
					let promiseList = [];
					if (files.length) {
						promiseList = files.map((item) => {
							return new Promise((resolve) => {
								this.$bk_httpUpLoadToTXCos({
									upFile: item,
									success: (data) => {
										resolve(data.url);
									}
								});
							});
						});
						Promise.all(promiseList).then((res) => {
							if (res.length) {
								res.forEach((url) => {
									insert(url);
								});
							}
						});
					}
				};
				this.editor.config.onchange = () => {
					this.changeEditorContent();
				};
				this.editor.create();
				this.editor.txt.html(this.defaultValue);
				this.initEditorEnable();
				this.listenCheckbox();
			},

			// 监听已存在的checkbox，记录其状态
			listenCheckbox () {
				const nodeElem = document.querySelectorAll('input[type="checkbox"]');
				nodeElem.forEach((item) => {
					if (this.disabled) {
						item.setAttribute('disabled', 'true');
					} else {
						item.removeAttribute('disabled');
					}
					item.addEventListener('change', (e) => {
						if (e.target.checked) {
							item.setAttribute('checked', 'true');
						} else {
							item.removeAttribute('checked');
						}
					});
				});
			},

			// 手动更新编辑器内容
			updateContentManual (content = '') {
				this.editor.txt.html(content);
			},
		}
	};
</script>

<style lang="less" scoped>
@import "editor";
</style>