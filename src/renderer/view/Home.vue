<template>
  <div>
    <div class="content nontextselect">
      <b-table
        hover
        responsive
        :sort-compare="mySortCompare"
        :items="files"
        :fields="fields"
        tbody-tr-class="file_row"
        tbody-class="is_body"
        sticky-header="100vh"
      >
        <template v-slot:head(check)="" v-if="files.length > 0">
          <div class="checkbox" >
            <input
              @change="chekedFiles($event)"
              class="cinput"
              type="checkbox"
              ref="chekone"
              id="chekone-all"
            />
            <label for="chekone-all"></label>
          </div>
        </template>
        <template #cell(check)="data">
          <div class="checkbox">
            <input
              @change="fileSelect($event)"
              class="cinput chekone"
              type="checkbox"
              :value="data.item.id"
              :id="`chekone-all-${data.item.id}`"
            />
            <label :for="`chekone-all-${data.item.id}`"></label>
          </div>
          <span class="file_status" v-show="activeFolderArr.userId !== user.id">
            <i
              class="fa"
              :class="
                data.item.status == 'not_viewed' ? 'fa-eye-slash' : 'fa-eye'
              "
              v-b-tooltip.hover
              :title="
                data.item.status == 'not_viewed'
                  ? 'Файл не просмотрен'
                  : 'Файл просмотрен'
              "
            ></i>
          </span>
        </template>
        <template #cell(name)="data">
          <div
            class="rows dragfile"
            @contextmenu.prevent="contextMenu($event, data)"
            :data-file="data.item.name"
            draggable="true"
            @dragstart="dragStartFile($event)"
          >
            <span
              class="file_icon"
              :inner-html.prop="data.item.name | icon()"
            ></span>
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
            <div
              class="download"
              @click="downloadFiles($event, data.item.name)"
            >
              <span class="file_size">{{ data.item.size | size() }}</span>
              Скачать
            </div>
          </div>
        </template>
      </b-table>
      <context-menu :display="showContextMenu" :position="style" ref="ctxmenu">
        <li>
          <button
            :disabled="actionButtonDisable(fileSelectArr.length > 1)"
            @click.prevent="actionEvent('getzip')"
          >
            Скачать архивом
          </button>
        </li>
        <li>
          <button
            :disabled="
              actionButtonDisable(
                fileSelectArr.length <= 1 &&
                  (activeFolderArr.userId == user.id || isOwner)
              )
            "
            @click.prevent="actionEvent('rename')"
          >
            Переименовать
          </button>
        </li>
        <li>
          <button
            :disabled="
              actionButtonDisable(activeFolderArr.userId == user.id || isOwner)
            "
            @click.prevent="actionEvent('delete')"
          >
            Удалить
          </button>
        </li>
      </context-menu>
    </div>
    <transition name="slide-down">
      <div class="file_actions" v-show="fileActionPanel">
        <button class="s_btn"
          :disabled="actionButtonDisable(fileSelectArr.length > 1)"
          @click.prevent="actionEvent('getzip')"
        >
          Скачать архивом
        </button>
        <button class="s_btn"
          :disabled="
            actionButtonDisable(
              fileSelectArr.length <= 1 &&
                (activeFolderArr.userId == user.id || isOwner)
            )
          "
          @click.prevent="actionEvent('rename')"
        >
          Переименовать
        </button>
        <button class="s_btn"
          :disabled="
            actionButtonDisable(activeFolderArr.userId == user.id || isOwner)
          "
          @click.prevent="actionEvent('delete')"
        >
          Удалить
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import ContextMenu from "@/components/ContextMenu";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "home",
  data() {
    return {
      activeFileItem: null,
      showContextMenu: false,
      showLoader: false,
      fileActionPanel: false,
      isOwner: false,
      fileSelectArr: [],
      zipFiles: "",
      menuState: 0,
      fileSort: null,
      visibleFiles: [],
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
    activeFolderArr() {
      this.$refs.chekone.checked = false;
      this.fileActionPanel = false;
    },
    visibleFiles(){
      
    },
    fileSelectArr() {
      let tableContent = document.querySelector(".b-table-sticky-header");
      if (this.fileSelectArr.length > 0) {
        this.fileActionPanel = true;
        tableContent.style.paddingBottom = "95px";
      } else {
        this.fileActionPanel = false;
        this.$refs.chekone.checked = false;
        tableContent.style.paddingBottom = "40px";
      }
    },
  },
  computed: {
    ...mapGetters(["users", "files", "user", "activeFolderArr"]),
    ifFolderOwner() {
      return Number(this.user.id) === Number(this.activeFolderArr.userId);
    },
  },
  mounted() {
    this.getAllFilesRow()
    this.contextinit()
    this.dragAndClick()
    let vm = this;
    let content = document.querySelector(".b-table-sticky-header");
    if (this.ifFolderOwner) {
      content.addEventListener("scroll", function (event) {
        vm.getAllFilesRow();
      });
    }
  },
  updated(){
    this.getAllFilesRow();
    // this.dragAndClick()
  },
  methods: {
    ...mapActions([
      "deleteFiles",
      "getFiles",
      "downloadZIP",
      "deleteZIP",
      "renameFile",
    ]),
    dragAndClick(){
      let rows = document.querySelectorAll(".file_row");
      rows.forEach((row) => {
        row.ondragstart = (event) => {
          let file = event.target.closest(".file_row").querySelector(".dragfile").dataset.file;
          event.preventDefault();
          console.log(file);
          ipcRenderer.send("ondragstart", file);
        };  
      });
      document.addEventListener("dblclick", function (e) {
          let row = e.target.closest(".file_row")
          if(row){
            let file = row.querySelector(".dragfile").dataset.file;
            ipcRenderer.send("openFile", file);
          }
        });
    },
    actionButtonDisable(param) {
      return !param;
    },
    mySortCompare(a, b, key) {
      if (key === "createDate") {
        return new Date(a.date) - new Date(b.date);
      } else {
        return false;
      }
    },
    getAllFilesRow() {
      if (this.ifFolderOwner) {
        let files = document.querySelectorAll(".file_row");
        files.forEach((file) => {
          let icon = file.querySelector(".file_status");
          if (!this.hasClass(icon, "is_viewed")&&this.isVisible(file)) {
            let visibleFiles = []
            visibleFiles.push(file.querySelector('.cinput').value)
            icon.classList.add("is_viewed");
            let vm = this;
            let scrolltimer = null;
            clearTimeout(scrolltimer);
            scrolltimer = setTimeout(function () {
              vm.$socket.emit("fileStatus", {...vm.activeFolderArr,fileId: [...visibleFiles],}, res=>{
                if(res=='done') vm.visibleFiles = []
              });
            }, 300);
          }
        });
      }
    },
    hasClass(el, clss) {
      return el.classList.contains(clss);
    },
    isVisible(tag) {
      // Все позиции элемента
      let targetPosition = {
          top: window.pageYOffset + tag.getBoundingClientRect().top,
          bottom: window.pageYOffset + tag.getBoundingClientRect().bottom,
        },
        // Получаем позиции окна
        contentPosition = {
          top: window.pageYOffset,
          bottom: window.pageYOffset + document.documentElement.clientHeight - 5,
        };
      if (
        targetPosition.bottom > contentPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
        targetPosition.top < contentPosition.bottom// Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
      ) {
        return true
      } else {
        return false
      }
    },
    dragStartFile(event) {
      // ipcRenderer.send('ondragstart', '/absolute/path/to/the/item')
    },
    fileSelect(event) {
      if (event.target.checked) {
        this.fileSelectArr.push(event.target.value);
        this.activeFileItem = this.files.find(
          (file) => file.id == event.target.value
        );
      } else {
        this.fileSelectArr = this.fileSelectArr.filter(
          (file) => Number(file) !== Number(event.target.value)
        );
      }
    },
    downloadFiles(event, file) {
      if (document.querySelector(".dprogress")) {
        document.querySelector(".dprogress").remove();
      }
      event.target.insertAdjacentHTML(
        "afterend",
        `<span class="dprogress"></span>`
      );
      let progress = event.target.nextSibling;
      ipcRenderer.send("download-url", file);
      ipcRenderer.on("downloadProgressStart", (event, percent) => {
        progress.style.width = `${percent}%`;
        if (percent >= 100) {
          setTimeout(() => {
            progress.style.opacity = "0";
          }, 1000);
          setTimeout(() => {
            progress.remove();
          }, 2000);
        }
      });
    },
    async actionEvent(option) {
      if (option == "getzip") {
        this.zipFiles = await this.downloadZIP(this.fileSelectArr);
        this.$smalltalk
          .confirm("Архивация", `${this.zipFiles}`, {
            buttons: {
              ok: "Скачать",
              cancel: "Отмена",
            },
          })
          .then(() => {
            let body = document.querySelector("body");
            this.$message(
              `Файлы успешно заархивированы`,
              "Уведомление об архивации",
              "success"
            );
            body.insertAdjacentHTML(
              "beforeend",
              `<a class="ziplink" href="${this.zipFiles}" download>${res.file}</a>`
            );
            let ziplink = document.querySelector(".ziplink");
            ziplink.click();

            setTimeout(() => {
              ziplink.remove();
            }, 10000);
            this.toggleMenuOff();
          })
          .catch(() => {
            let zipFileName = this.zipFiles.split("/").pop();
            this.deleteZIP(zipFileName);
            this.fileActionPanel = false;
            this.toggleMenuOff();
          });
      } else if (option == "rename") {
        let fileExt = this.activeFileItem.originalName.split(".").pop();
        let fileName = this.activeFileItem.originalName.replace(
          `.${fileExt}`,
          ""
        );
        this.$smalltalk
          .prompt("Переивеновать", "Введите новое имя файла", `${fileName}`, {
            buttons: {
              ok: "Переименовать",
              cancel: "Отмена",
            },
          })
          .then((newFileName) => {
            if (newFileName != fileName) {
              newFileName = newFileName + "." + fileExt;
              if (
                this.renameFile({
                  id: this.activeFileItem.id,
                  originalName: newFileName,
                  folderId: this.activeFileItem.folderId,
                })
              ) {
                this.$socket.emit("updateChange", {
                  ...this.user,
                  activeFolderUserId: this.activeFolderArr.userId,
                });
                this.$message(
                  `Файл ${fileName} успешно переименован в ${newFileName}`,
                  "Уведомление об изменении",
                  "success"
                );
                this.fileActionPanel = false;
                this.toggleMenuOff();
              }
            }
          })
          .catch((err) => {
            this.fileActionPanel = false;
            this.toggleMenuOff();
          });
      } else if (option == "delete") {
        this.$smalltalk
          .confirm("Удаление", `Вы действительно хотите удалить файл(ы)?`, {
            buttons: {
              ok: "Удалить",
              cancel: "Отмена",
            },
          })
          .then(() => {
            if (this.activeFileItem) {
              this.fileSelectArr.push(this.activeFileItem.id);
            }
            this.delete();
            this.fileActionPanel = false;
            this.$socket.emit("updateChange", {
              ...this.user,
              activeFolderUserId: this.activeFolderArr.userId,
            });
            this.fileSelectArr = [];
            this.toggleMenuOff();
          })
          .catch((err) => {
            this.fileActionPanel = false;
            this.toggleMenuOff();
          });
      }
    },
    contextMenu(event, data) {
      if (data.item.ownerId === this.user.id) {
        this.isOwner = true;
      } else {
        this.isOwner = false;
      }
      this.activeFileItem = data.item;
      let coord = this.positionMenu(event);
      this.toggleMenuOn();
      this.style.top = coord.top;
      this.style.left = coord.left;
      this.outsideClick(event.target);
    },
    getPosition(e) {
      let posx = 0;
      let posy = 0;
      if (!e) e = window.event;
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx =
          e.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        posy =
          e.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }
      return {
        x: posx,
        y: posy,
      };
    },
    positionMenu(e) {
      let clickCoords = this.getPosition(e);
      let clickCoordsX = clickCoords.x;
      let clickCoordsY = clickCoords.y;
      let menuWidth = 180 + 15;
      let menuHeight = 135 + 15;
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      let top = "";
      let left = "";

      if (windowWidth - clickCoordsX < menuWidth) {
        left = windowWidth - menuWidth + "px";
      } else {
        left = clickCoordsX + "px";
      }

      if (windowHeight - clickCoordsY < menuHeight) {
        top = windowHeight - menuHeight + "px";
      } else {
        top = clickCoordsY + "px";
      }
      return { top, left };
    },
    contextinit() {
      this.keyupListener();
      this.resizeListener();
    },
    keyupListener() {
      let that = this;
      window.onkeyup = function (e) {
        if (e.keyCode === 27) {
          that.toggleMenuOff();
        }
      };
    },
    resizeListener() {
      let that = this;
      window.onresize = function (e) {
        that.toggleMenuOff();
      };
    },
    toggleMenuOn() {
      if (this.menuState !== 1) {
        this.menuState = 1;
        this.showContextMenu = true;
      }
    },
    toggleMenuOff() {
      if (this.menuState !== 0) {
        this.menuState = 0;
        this.showContextMenu = false;
      }
    },
    outsideClick(elem) {
      let that = this;
      function outsideClickListener(event) {
        if (!elem.contains(event.target) && isVisible(elem)) {
          that.toggleMenuOff();
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
    chekedFiles(event) {
      let inputOne = document.querySelectorAll(".chekone");
      this.fileSelectArr = [];
      if (event.target.checked) {
        inputOne.forEach((input) => {
          input.checked = true;
          this.fileSelectArr.push(Number(input.value));
        });
      } else {
        inputOne.forEach((input) => {
          input.checked = false;
          event.target.checked = false;
        });
      }
    },
    async delete() {
      let fileParam = {
        id: this.fileSelectArr,
        folderId: this.activeFolderArr.id,
      };
      let success = await this.deleteFiles(fileParam);
      if (success) {
        this.$message(`Файл(ы) успешно удален(ы)!`, "", "success");
        this.$refs.chekone.checked = false;
        let inputOne = document.querySelectorAll(".chekone");
        inputOne.forEach((input) => {
          input.checked = false;
        });
        this.fileActionPanel = false;
      }
    },
  },
  components: {
    ContextMenu,
  },
};
</script>