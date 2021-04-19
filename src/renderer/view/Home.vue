<template>
  <div class="content">
    <transition name="slide-down">
      <div class="file_actions" v-show="fileActionPanel">
        <button @click.prevent="actionEvent('getzip')">Скачать архивом</button>
        <button @click.prevent="actionEvent('rename')">Переименовать</button>
        <button
          v-if="activeFolderArr && activeFolderArr.id == user.id"
          @click.prevent="actionEvent('delete')"
        >
          Удалить
        </button>
      </div>
    </transition>
    <b-table hover :items="files" :fields="fields">
      <template v-slot:head(check)="">
        <input
          @change="chekedFiles($event)"
          class="cinput"
          type="checkbox"
          ref="chekone"
        />
      </template>
      <template #cell(check)="data">
        <input
          @change="fileSelect($event)"
          class="cinput chekone"
          type="checkbox"
          :value="data.item.id"
        />
      </template>
      <template #cell(name)="data">
        <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
          <div class="dragfile"></div>
          <span class="file_icon" v-html="fileExt(data.item.name)"></span>
          {{ data.item.originalName }}
        </div>
      </template>
      <template #cell(createDate)="data">
        <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
          {{ data.item.date | date("datetime") }}
        </div>
      </template>
      <template #cell(ownerName)="data">
        <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
          {{ data.item.ownerName }}
        </div>
      </template>
      <template #cell(size)="data">
        <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
          <div class="download" @click="downloadFiles(data.item.name)">
            Скачать {{ bytesToSize(data.item.size) }}
          </div>
        </div>
      </template>
    </b-table>

    <context-menu :display="showContextMenu" :position="style">
      <li @click.prevent="actionEvent('notice')">Уведомить</li>
      <li @click.prevent="actionEvent('rename')">Переименовать</li>
      <li
        v-if="
          activeFolderArr &&
          (activeFolderArr.id == user.id || activeFolderArr.ownerId == user.id)
        "
        @click.prevent="actionEvent('delete')"
      >
        Удалить
      </li>
    </context-menu>
    <DragDroup v-show="activeFolderArr" />
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import ContextMenu from "@/components/ContextMenu";
import DragDroup from "@/components/DragDroupUploader";
import smalltalk from "smalltalk";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "home",
  data() {
    return {
      contextActiveItem: null,
      showContextMenu: false,
      showLoader: false,
      fileActionPanel: false,
      fileSelectArr: [],
      style: {
        top: "",
        left: "",
      },
      fields: [
        {
          key: "check",
          label: "",
          class: "chekall",
        },
        {
          key: "name",
          label: "Имя файла",
          sortable: true,
        },
        {
          key: "createDate",
          label: "Дата создания",
          sortable: true,
        },
        {
          key: "ownerName",
          label: "Создатель",
          sortable: true,
        },
        {
          key: "size",
          label: "Размер",
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          //variant: 'success'
        },
      ],
      items: [
        {
          isActive: true,
          age: 40,
          first_name: "Dickerson",
          last_name: "Macdonald",
        },
        { isActive: false, age: 21, first_name: "Larsen", last_name: "Shaw" },
        { isActive: false, age: 89, first_name: "Geneva", last_name: "Wilson" },
        { isActive: true, age: 38, first_name: "Jami", last_name: "Carney" },
      ],
    };
  },
  watch: {
    fileSelectArr() {
      if (this.fileSelectArr.length > 0) {
        this.fileActionPanel = true;
      } else {
        this.fileActionPanel = false;
        this.$refs.chekone.checked = false;
      }
    },
  },
  computed: {
    ...mapGetters(["users", "files", "user", "activeFolderArr"]),
  },
  mounted() {
    document.querySelector('.dragfile').ondragstart = (event) => {
      event.preventDefault()
      console.log('drag');
      ipcRenderer.send('ondragstart', '/absolute/path/to/the/item')
    }
  },
  methods: {
    ...mapActions(["deleteFiles", "getFiles", "downloadZIP"]),
    fileSelect(event) {
      if (event.target.checked) {
        this.fileSelectArr.push(event.target.value);
      } else {
        this.fileSelectArr = this.fileSelectArr.filter(
          (file) => file !== event.target.value
        );
      }
    },
    downloadFiles(file){
      ipcRenderer.send('download-url', file);
    },
    async actionEvent(option) {
      if (option == "getzip") {
        let res = await this.downloadZIP(this.fileSelectArr)
        smalltalk
          .confirm("Архивация", `${res.file}`, {
            buttons: {
              ok: "Скачать",
              cancel: "Отмена",
            },
          })
          .then(() => {
            let body = document.querySelector('body')
            body.insertAdjacentHTML('beforeend', `<a class="ziplink" href="${res.file}" download>${res.file}</a>`);
            let ziplink = document.querySelector('.ziplink')
            ziplink.click()
            setTimeout(()=>{
              ziplink.remove()
            }, 10000)
            this.fileActionPanel = false
          })
          .catch(() => {
            console.log("no");
          });
      } else if (option == "rename") {
        alert("rename");
        this.fileActionPanel = false
      } else if (option == "delete") {
        smalltalk
          .confirm("Удаление", `Вы действительно хотите удалить файл(ы)?`, {
            buttons: {
              ok: "Удалить",
              cancel: "Отмена",
            },
          })
          .then(() => {
            this.delete();
            this.fileActionPanel = false
          })
          .catch(() => {
            console.log("no");
          });
      }
    },
    contextMenu(event, data) {
      this.contextActiveItem = data;
      this.style.top = event.clientY;
      this.style.left = event.clientX;
      this.outsideClick(event.target);
      this.showContextMenu = true;
    },
    outsideClick(elem) {
      let that = this;
      function outsideClickListener(event) {
        if (!elem.contains(event.target) && isVisible(elem)) {
          that.showContextMenu = false;
          document.removeEventListener("click", outsideClickListener);
        }
      }
      document.addEventListener("click", outsideClickListener);
      function isVisible(elem) {
        //открыто ли условное окно
        return (
          !!elem &&
          !!(
            elem.offsetWidth ||
            elem.offsetHeight ||
            elem.getClientRects().length
          )
        );
      }
    },
    contextItemClick(option) {
      if (option == "notice") {
        console.log("notice");
      } else if (option == "rename") {
        smalltalk
          .prompt(
            "Переивеновать",
            "Введите новое имя файла",
            `${fileName[0]}`,
            {
              buttons: {
                ok: "Переименовать",
                cancel: "Отмена",
              },
            }
          )
          .then((newFileName) => {
            if (newFileName != data.file) {
              this.$message(
                `Файл ${data.file} успешно переименован в ${
                  newFileName + "." + fileExt
                }`,
                "",
                "success"
              );
              this.getDirContent(this.$path.resolve(this.dirPath));
            }
          })
          .catch(() => {
            console.log("cancel");
          });
      } else if (option == "delete") {
        smalltalk
          .confirm(
            "Удаление",
            `Вы действительно хотите удалить файл '${data.file}'?`,
            {
              buttons: {
                ok: "Удалить",
                cancel: "Отмена",
              },
            }
          )
          .then(() => {
            this.$message(`Файл '${data.file}' успешно удален!`, "", "success");
          })
          .catch(() => {
            console.log("no");
          });
      }
    },
    bytesToSize(bytes) {
      let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
    chekedFiles(event) {
      let inputOne = document.querySelectorAll(".chekone");
      this.fileSelectArr = [];
      if (event.target.checked) {
        inputOne.forEach((input) => {
          input.checked = true;
          this.fileSelectArr.push(input.value);
        });
      } else {
        inputOne.forEach((input) => {
          input.checked = false;
          event.target.checked = false;
        });
      }
    },
    delete(){
      let success = this.deleteFiles(this.fileSelectArr)
      if(success){
        this.$message(`Файл(ы) успешно удален(ы)!`, "", "success");
        this.$refs.chekone.checked = false
        this.getFiles(this.activeFolderArr.id)
      }
    },
    fileExt(filename) {
      let ext = filename.split(".").pop();
      let icon = "";
      switch (ext.toLowerCase()) {
        case "zip":
        case "rar":
        case "7zip":
          icon = `<i class="fa fa-file-archive-o" style="color: #f7b731"></i>`;
          break;
        case "pdf":
          icon = `<i class="fa fa-file-pdf-o" style="color: #eb3b5a"></i>`;
          break;
        case "doc":
        case "docx":
          icon = `<i class="fa fa-file-word-o" style="color: #3867d6"></i>`;
          break;
        case "xls":
        case "xlsx":
          icon = `<i class="fa fa-excel-o" style="color: #3867d6"></i>`;
          break;
        case "sql":
          icon = `<i class="fa fa-database" style="color: #f7b731"></i>`;
          break;
        case "exe":
          icon = `<i class="fa fa-cog" style="color: #808080"></i>`;
          break;
        case "gif":
        case "png":
        case "jpeg":
        case "jpg":
          icon = `<i class="fa fa-file-image-o" style="color: #00b894"></i>`;
          break;
        default:
          icon = `<i class="fa fa-file" style="color: #808080"></i>`;
          break;
      }
      return icon;
    },
  },
  components: {
    ContextMenu,
    DragDroup,
  },
};
</script>