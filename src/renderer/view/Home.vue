<template>
  <div id="home">
      <app-sidebar v-on:dir="getDirContent"></app-sidebar>
    <div class="content">
      <app-header></app-header>
      <b-table hover :items="dirContent" :fields="fields">
        <!-- <template #row-details="row" @contextmenu.prevent="$refs.menu.open($event, { item, index })">
      </template> -->
      </b-table>
      <ul class="file_list" v-if="dirContent.length > 0">
        <li @contextmenu.prevent="$refs.menu.open($event, { file, index })" v-for="(file, index) in dirContent" :key="index">{{ file }}</li>
      </ul>
      <vue-context ref="menu" v-slot="{ data }">
          <li>
              <a href="#" @click.prevent="contextItemClick(data,'notice')">Уведомить</a>
          </li>
          <li>
              <a href="#" @click.prevent="contextItemClick(data,'rename')">Переименовать</a>
          </li>
          <li>
              <a href="#" @click.prevent="contextItemClick(data,'delete')">Удалить</a>
          </li>
      </vue-context>
      <div class="addcontent" v-show="dirContent.length > 0">
        <div id="drag-file" class="add_btn" @click="addfiles">
          перетащите или кликните, чтобы прикрепить файл(ы)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "@/layout/Sidebar"
import AppHeader from "@/layout/Header"
// import VueContext from 'vue-context'
// import smalltalk from 'smalltalk'
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
export default {
  name: "home",
  data() {
    return {
      dirContent: [],
      dirPath: "",
      contextActiveItem: null,
      fields: [
          {
            key: 'name',
            label: 'Имя файла',
            sortable: true
          },
          {
            key: 'createDateTime',
            label: 'Дата создания',
            sortable: true,
          },
          {
            key: 'changeDateTime',
            label: 'Дата изменения',
            sortable: true,
            // Variant applies to the whole column, including the header and footer
            //variant: 'success'
          },
          {
            key: 'size',
            label: 'Размер',
            sortable: true,
            // Variant applies to the whole column, including the header and footer
            //variant: 'success'
          }
        ],
        items: [
          { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
        ]
    }
  },
  mounted() {
    let holder = document.getElementById("drag-file")
      holder.classList = ""
      // срабатывает, когда элемент будет перенесен на заданную зону (цель для переноса)
      holder.ondragenter = () => {
        holder.classList = "active"
        return false
      }
      // срабатывает, когда элемент перемещают над допустимой зоной для переноса
      holder.ondragover = () => {
        // console.log(holder)
        return false
      }
      // срабатывает в начале операции перетаскивания элемента
      holder.ondragstart = () => {
        return false
      }
      // срабатывает, когда элемент выходит из допустимой зоны для переноса
      holder.ondragleave = () => {
        holder.classList = ""
        return false
      }
      // срабатывает, когда элемент перетаскивается
      holder.ondrag = () => {
        return false
      }
      // срабатывает после того, как перетаскиваемый элемент опустился на объект перетаскивания
      holder.ondrop = async (e) => {
        e.preventDefault()
        let fileName = []
        for (let f of e.dataTransfer.files) {
          fileName.push(f.name)
          let source = f.path
          let destination = this.$path.resolve(this.dirPath) + "/" + f.name
          await this.$fs
            .createReadStream(source)
            .pipe(this.$fs.createWriteStream(destination))
          holder.classList = ""
          this.getDirContent(this.$path.resolve(this.dirPath))
        }
        return false
      }
      // рабатывает, когда пользователь закончил перетаскивание элемента
      holder.ondragend = () => {
        return false
      }
  },
  methods: {
    contextItemClick(data, option) {
      let filePath = this.$path.resolve(this.dirPath) + "/" +data.file
      if(option == 'notice'){
        console.log('notice')
      }else if(option == 'rename'){
        let fileName = data.file.split('.')
        let fileExt = data.file.split('.').pop()
        smalltalk.prompt('Переивеновать', 'Введите новое имя файла', `${fileName[0]}`, {
          buttons: {
            ok: 'Переименовать',
            cancel: 'Отмена',
        }})
        .then((newFileName) => {
            if(newFileName != data.file){
              this.$fs.rename(filePath, this.$path.resolve(this.dirPath) + '/' +newFileName+'.'+fileExt, () => { 
                this.$message(`Файл ${data.file} успешно переименован в ${newFileName+'.'+fileExt}`, '', 'success')
                this.getDirContent(this.$path.resolve(this.dirPath))
              })
            }
        })
        .catch(() => {
            console.log('cancel');
        })
      }else if(option == 'delete'){
        smalltalk.confirm('Удаление', `Вы действительно хотите удалить файл '${data.file}'?`, {
          buttons: {
            ok: 'Удалить',
            cancel: 'Отмена',
        }})
        .then(() => {
          this.$fs.unlink(filePath, (err) => {
              if (err) throw err
              this.$message(`Файл '${data.file}' успешно удален!`, '', 'success')
              this.getDirContent(this.$path.resolve(this.dirPath))
          })
        })
        .catch(() => {
            console.log('no');
        })
      }
    },
    getDirContent(dir) {
      this.dirPath = dir
      this.dirContent = []
// var stats = fs.statSync("myfile.txt")
// var fileSizeInBytes = stats.size;
// // Convert the file size to megabytes (optional)
// var fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
      this.$fs.readdirSync(dir, { withFileTypes: true }).map((d) => {
        let stats = this.$fs.statSync(this.$path.resolve(this.dirPath)+'/'+d)
        console.log(stats)
        this.dirContent.push({name: d, createDateTime: stats.birthtimeMs, changeDateTime: stats.mtimeMs, size: bytesToSize(stats.size)})
      })
    },
    addfiles() {
      let options = {
        title: "",
        defaultPath: "",
        buttonLabel: "",
        properties: ["openFile", "multiSelections"],
      }
      let files = this.$electron.remote.dialog.showOpenDialog(options)
      let destination = this.$path.resolve(this.dirPath) + "/"
      if (files.length >= 2) {
        files.forEach((file) => {
          console.log("file" + file.split("/").pop())
          this.$fs
            .createReadStream(file)
            .pipe(
              this.$fs.createWriteStream(destination + file.split("/").pop())
            )
          this.getDirContent(this.$path.resolve(this.dirPath))
          
        })
      } else {
        this.$fs
          .createReadStream(files[0])
          .pipe(
            this.$fs.createWriteStream(destination + files[0].split("/").pop())
          )
          this.getDirContent(this.$path.resolve(this.dirPath))
      }
    },
  },
  components: {
    AppSidebar,
    AppHeader,
    //VueContext
  },
}
</script>