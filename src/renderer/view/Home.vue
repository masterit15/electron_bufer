<template>
  <div id="home wrapper">
    <div id="container">
      <app-sidebar v-on:folder="getFolder"></app-sidebar>
      <div id="resizer"></div>
      <div id="main" class="content" data-simplebar>
        <app-header></app-header>
        <b-table hover :items="dirContent" :fields="fields">
          <template #cell(name)="data">
            <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
              {{ data.item.name }}
            </div>
          </template>
          <template #cell(createDateTime)="data">
            <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
              {{ data.item.createDateTime }}
            </div>
          </template>
          <template #cell(changeDataTime)="data">
            <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
              {{ data.item.changeDataTime }}
            </div>
          </template>
          <template #cell(size)="data">
            <div class="rows" @contextmenu.prevent="contextMenu($event, data)">
              {{ data.item.size }}
            </div>
          </template>
        </b-table>

        <context-menu :display="showContextMenu" :position="style">
          <li @click.prevent="contextItemClick('notice')">Уведомить</li>
          <li @click.prevent="contextItemClick('rename')">Переименовать</li>
          <li @click.prevent="contextItemClick('delete')">Удалить</li>
        </context-menu>
        <pre>
          {{ users }}
          </pre>
        <div class="addcontent" v-if="showLoader">
          <DragDroup />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "@/layout/Sidebar";
import AppHeader from "@/layout/Header";
import ContextMenu from "@/components/ContextMenu";
import DragDroup from "@/components/DragDroupUploader";
import smalltalk from "smalltalk";
import { mapGetters } from "vuex";
function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
export default {
  name: "home",
  data() {
    return {
      dirContent: [],
      dirPath: "",
      contextActiveItem: null,
      showContextMenu: false,
      showLoader: false,
      style: {
        top: "",
        left: "",
      },
      fields: [
        {
          key: "name",
          label: "Имя файла",
          sortable: true,
        },
        {
          key: "createDateTime",
          label: "Дата создания",
          sortable: true,
        },
        {
          key: "changeDateTime",
          label: "Дата изменения",
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          //variant: 'success'
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
  computed: {
    ...mapGetters(["users"]),
  },
  methods: {
    contextMenu(event, data) {
      this.contextActiveItem = data;
      console.log(data);
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
            this.getDirContent(this.$path.resolve(this.dirPath));
          })
          .catch(() => {
            console.log("no");
          });
      }
    },
    getFolder(folder) {
      console.log(folder)
    },
  },
  components: {
    AppSidebar,
    AppHeader,
    ContextMenu,
    DragDroup,
  },
};
</script>