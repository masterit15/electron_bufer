<template>
  <div class="content nontextselect mCustomScrollbar">
    <transition name="slide-down">
      <div class="file_actions" v-show="fileActionPanel">
        <button v-if="fileSelectArr.length > 1" @click.prevent="actionEvent('getzip')">Скачать архивом</button>
        <button v-if="fileSelectArr.length == 1" @click.prevent="actionEvent('rename')">Переименовать</button>
        <button v-if="activeFolderArr.userId == user.id || isOwner" @click.prevent="actionEvent('delete')">Удалить</button>
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
        <div class="rows dragfile" @contextmenu.prevent="contextMenu($event, data)" :data-file="data.item.name" draggable="true" 
          @dragstart="dragStartFile($event)" >
          <span class="file_icon" :inner-html.prop="data.item.name|icon()"></span>
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
            <span class="file_size">{{ data.item.size | size() }}</span> Скачать
          </div>
        </div>
      </template>
    </b-table>
    <context-menu :display="showContextMenu" :position="style">
      <li @click.prevent="actionEvent('notice')">Уведомить</li>
      <li v-if="activeFolderArr.userId == user.id || isOwner" @click.prevent="actionEvent('rename')">Переименовать</li>
      <li v-if="activeFolderArr.userId == user.id || isOwner" @click.prevent="actionEvent('delete')">Удалить</li>
    </context-menu>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import ContextMenu from "@/components/ContextMenu";
import smalltalk from "smalltalk";
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
    let dragFiles = document.querySelectorAll('.dragfile')
    dragFiles.forEach(dragFile=>{
      dragFile.ondragstart = (event) => {
        event.preventDefault()
        ipcRenderer.send('ondragstart', dragFile.dataset.file)
      }
    })
  },
  methods: {
    ...mapActions(["deleteFiles", "getFiles", "downloadZIP", "renameFile"]),
    dragStartFile(event){
      // console.log('dragStartFile',event);
      // ipcRenderer.send('ondragstart', '/absolute/path/to/the/item')
    },
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
        let fileExt = this.activeFileItem.originalName.split('.').pop()
        let fileName = this.activeFileItem.originalName.replace(`.${fileExt}`, '');
        smalltalk
          .prompt(
            "Переивеновать",
            "Введите новое имя файла",
            `${fileName}`,
            {
              buttons: {
                ok: "Переименовать",
                cancel: "Отмена",
              },
            }
          )
          .then((newFileName) => {
            if (newFileName != fileName) {
              newFileName = newFileName + "." + fileExt
              this.renameFile({id: this.activeFileItem.id, originalName: newFileName, folderId: this.activeFileItem.folderId })
              this.$message(
                `Файл ${fileName} успешно переименован в ${newFileName}`,
                "",
                "success"
              );

              this.fileActionPanel = false
            }
          })
          .catch(() => {
            this.fileActionPanel = false
          });
        
      } else if (option == "delete") {
        smalltalk
          .confirm("Удаление", `Вы действительно хотите удалить файл(ы)?`, {
            buttons: {
              ok: "Удалить",
              cancel: "Отмена",
            },
          })
          .then(() => {
            console.log(this.fileSelectArr);
            this.fileSelectArr.push(this.activeFileItem.id)
            this.delete();
            this.fileActionPanel = false
            // this.fileSelectArr = []
          })
          .catch(() => {
            console.log("no");
          });
      }
    },
    contextMenu(event, data) {
      // console.log(data.item.ownerId);

      if(data.item.ownerId === this.user.id){
        this.isOwner = true
      }else{
        this.isOwner = false
      }
      this.activeFileItem = data.item
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
    async delete(){
      let fileParam = {
        id: this.fileSelectArr,
        folderId: this.activeFileItem.folderId
      }
      let success = await this.deleteFiles(fileParam)
      if(success){
        this.$message(`Файл(ы) успешно удален(ы)!`, "", "success");
        // this.$refs.chekone.checked = false
      }
    }
  },
  components: {
    ContextMenu,
  },
};
</script>