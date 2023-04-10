"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue/dist/vue"));
const utils_1 = require("../../utils");
const typeNames = ['res-bundle', 'res-native', 'resources'];
exports.default = vue_1.default.extend({
    template: utils_1.getTemplate('create-res'),
    data() {
        return {
            inputName: '',
            display: '',
            typeSelects: ['公共动态目录', '公共静态目录', 'resources'],
            typeSelectIndex: 0,
            showLoading: false
        };
    },
    methods: {
        onChangeTypeSelect(index) {
            this.typeSelectIndex = Number(index);
        },
        async onClickCreate() {
            const folderName = typeNames[this.typeSelectIndex];
            const folderPath = `db://assets/${folderName}`;
            const name = utils_1.stringCase(this.inputName, true);
            if (/^[a-z][a-z0-9-]*[a-z0-9]+$/.test(name) === false) {
                this.display = '[错误] 名字不合法\n匹配规则: /^[a-z][a-z0-9-]*[a-z0-9]+$/\n1、不能以数字开头\n2、不能有大写字母\n3、分隔符只能使用-\n4、不能以分隔符开头或结尾';
                return;
            }
            this.display = '创建中';
            this.showLoading = true;
            if (!await utils_1.createFolderByUrl(folderPath, {
                readme: utils_1.getReadme(folderName),
                meta: folderName === 'resources' ? utils_1.getMeta('resources') : undefined,
                subFolders: [
                    {
                        folder: name,
                        meta: this.typeSelectIndex === 0 ? utils_1.getMeta('resources') : undefined
                    }
                ]
            })) {
                this.showLoading = false;
                this.display = '[错误] 创建失败';
                return;
            }
            this.showLoading = false;
            this.display = `[成功] 创建成功\n${folderPath}`;
        }
    },
});
