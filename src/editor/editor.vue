<template>
  <div class="editor-box" id="wangeditor">
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
    />
    <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="createEditor"
        @onChange="editorChange"
    />
  </div>
</template>

<script>
	import '@wangeditor-next/editor/dist/css/style.css';
	import {Boot} from '@wangeditor-next/editor';
	import {Editor, Toolbar} from '@wangeditor-next/editor-for-vue';
	import Checkbox from './checkbox/module';

	Boot.registerModule(Checkbox);


	export default {
		name: 'editor',

		components: {Editor, Toolbar},


		data () {
			const _this = this;
			return {
				mode: 'default',

				editorRef: null,

				toolbarConfig: {
					excludeKeys: ['insertImage', 'group-video', 'todo', '|'],
					insertKeys: {
						index: 0,
						keys: 'checkbox'
					}
				},

				editorConfig: {
					placeholder: '请输入内容...',
					showLinkImg: false,
					MENU_CONF: {
						uploadImage: {
							server: '/upload',
							async customUpload (file, insertFn) {
								// const testUrl = 'https://static-global.boka.vc/aime/def/Def_Empty_Avatar_CustomerF_Circle.png';
								_this.$bk_httpUpLoadToTXCos({
									upFile: file,
									success: (data) => {
										insertFn(data.url);
									}
								});
							}
						}
					}
				},

				valueHtml: '',
			};
		},

		created () {
			// this.registerMenu();
		},

		mounted () {
		},

		methods: {
			/**
			 * 创建编辑器实例
			 * @param editor
			 */
			createEditor (editor) {
				this.editorRef = Object.seal(editor);
			},

			/**
			 * 编辑器内容变更
			 */
			editorChange (e) {
				console.log(e, '编辑器内容变更');
        console.log(this.valueHtml)
			},
		},

		/**
		 * 组件销毁
		 */
		beforeUnmount () {
			if (this.editorRef == null) {
				return;
			}
			this.editorRef.destroy();
		},

	};
</script>

<style lang="less" scoped>
@import "editor";

:deep(.w-e-full-screen-container) {
  z-index: 10002;
}

input[type='checkbox'] {
  display: inline-block;
  margin-right: 10px;
}
</style>