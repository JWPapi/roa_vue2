<template>
  <div>
    <div
      :class="multiple || !files.length || 'sr-only'"
      class="paragraph justify-center flex flex-wrap"
    >
      <ul class="flex flex-wrap">
        <li v-for="(file, idx) in files" :key="idx" class="mr-4">
          <img
            v-if="isImage(file)"
            :src="transformFileToSrc(file)"
            class="w-32 h-40 object-cover"
          />
          <p class="tiny text-gray truncate w-32">{{ file.name }}</p>
          <roa-icon-button small icon="trash" @click.prevent="removeFile(idx)">
            Remove
          </roa-icon-button>
        </li>
      </ul>
      <label
        class="
          flex flex-col
          border
          items-center
          justify-center
          h-40
          cursor-pointer
        "
        :class="{
          'w-full bg-white shadow rounded-lg cursor-pointer': !files.length,
          'w-32 bg-gray-lightest text-gray-dark': files.length,
          'border-gray-darkest': (focused || dragover) && !error,
          'border-transparent': !(focused || dragover),
          'outline-red': error,
        }"
        @drop="handleFileDrop"
        @dragenter="dragover = true"
        @dragleave="dragover = false"
      >
        <input
          type="file"
          @focus="focused = true"
          @blur="focused = false"
          class="sr-only"
          @change="handleFileUpload"
          v-bind="{ multiple, name, accept, ...$attrs }"
        />
        <roa-icon
          :name="files.length ? 'plus' : icon"
          class="text-4xl pointer-events-none"
        ></roa-icon>
        <p class="mt-4 pointer-events-none" v-if="!files.length">
          {{ label }}
        </p>
      </label>
    </div>
    <div
      v-if="!multiple && files.length"
      class="flex items-start justify-center paragraph"
    >
      <div>
        <img
          v-if="isImage(files[0])"
          :src="transformFileToSrc(files[0])"
          class="max-w-xs h-40 object-cover"
        />
        <div
          v-else
          class="
            w-32
            text-6xl
            h-40
            bg-gray-lightest
            rounded
            text-gray-solid
            flex
            items-center
            justify-center
          "
        >
          <roa-icon name="document"></roa-icon>
        </div>
        <p class="tiny mt-2 text-gray truncate w-40">{{ files[0].name }}</p>
      </div>
      <roa-icon-button small icon="trash" @click.prevent="removeFile()">
        Remove
      </roa-icon-button>
    </div>
    <p v-if="error" class="text-red items-center mt-2 tiny flex" role="alert">
      <roa-icon
        name="attention-outline"
        class="mx-2 text-base flex-shrink-0 -mt-1 inline-block"
      />
      <span class="flex-1" v-html="error"> </span>
    </p>
  </div>
</template>

<script>
import RoaIcon from "./RoaIcon.vue";
import RoaIconButton from "./RoaIconButton.vue";
export default {
  components: { RoaIconButton, RoaIcon },
  props: {
    name: { type: String, default: "file" },
    label: { type: String, default: "Drag or click to upload a file" },
    icon: { type: String, default: "user-upload" },
    accept: { type: String, default: "image/png, image/jpeg" },
    multiple: { type: Boolean, default: false },
    maxBytes: { type: Number, default: 5 * 1024 * 1024 }, // Default: 5 Megabyte
    minWidth: { type: Number, default: 1200 },
    minHeight: { type: Number, default: 1200 },
    value: { type: File | Array },
  },
  data() {
    return {
      files: this.value || [],
      focused: false,
      dragover: false,
      error: "",
    };
  },
  methods: {
    removeFile(idx) {
      if (idx === undefined) this.files = [];
      else this.files.splice(idx, 1);
      this.emitChange();
    },
    handleFileDrop(event) {
      this.dragover = false;
      const droppedFiles = event.dataTransfer.files;
      if (!droppedFiles || (!this.multiple && this.files.length)) return;
      if (!this.multiple) return this.addFile(droppedFiles[0]);
      [...droppedFiles].forEach((file) => {
        this.addFile(file);
      });
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files || (!this.multiple && this.files.length)) return;
      if (!this.multiple) return this.addFile(files[0]);
      [...files].forEach((file) => {
        this.addFile(file);
      });
    },
    addFile(file) {
      if (!file.type) {
        this.error =
          "We don't support this file type. Please make sure you uploaded the correct file.";
        return;
      }
      if (
        this.accept &&
        this.accept !== "*" &&
        !this.accept.includes(file.type)
      ) {
        this.error = `We don't support this file type. The file has to be of type ${this.accept
          .split(", ")
          .join(" or ")}. The provided file is of type ${file.type}`;
        return;
      } else if (file.size > this.maxBytes) {
        this.error = `This file is too large. The maximum file size is ${(
          this.maxBytes /
          (1024 * 1024)
        ).toFixed(2)}MB. The provided file has ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`;
        return;
      }
      if (this.isImage(file)) {
        const img = new Image();
        img.src = this.transformFileToSrc(file);
        img.onload = () => {
          if (img.width < this.minWidth || img.height < this.minHeight)
            return (this.error = `This image size is too low. All images must be at least ${this.minWidth}px wide and ${this.minHeight}px high. The provided file is ${img.width}px wide and ${img.height}px high.`);
          this.error = "";
          this.files.push(file);
        };
      } else {
        this.error = "";
        this.files.push(file);
      }
      this.emitChange();
    },
    emitChange() {
      this.$emit("change", this.multiple ? this.files : this.files[0]);
    },
    isImage(file) {
      return file?.type?.includes("image");
    },
    transformFileToSrc(file) {
      return URL.createObjectURL(file);
    },
  },
};
</script>