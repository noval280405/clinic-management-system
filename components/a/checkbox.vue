<template>
  <div class="checkbox-wrapper-46">
    <input
      type="checkbox"
      class="inp-cbx"
      :id="uid"
      :value="value"
      :checked="isChecked"
      @change="toggle"
    />

    <label :for="uid" class="cbx">
      <span>
        <svg viewBox="0 0 12 10" height="10px" width="12px">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span>

      <span v-if="label">{{ label }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: {
    type: [Array, Boolean],
    default: false
  },
  value: {
    type: [String, Number],
    default: true
  },
  label: String
})

const emit = defineEmits(["update:modelValue"])

const uid = `cbx-${Math.random().toString(36).slice(2)}`

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue
})

function toggle(e) {
  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]

    if (e.target.checked) {
      newValue.push(props.value)
    } else {
      const i = newValue.indexOf(props.value)
      if (i > -1) newValue.splice(i, 1)
    }

    emit("update:modelValue", newValue)
  } else {
    emit("update:modelValue", e.target.checked)
  }
}
</script>

<style scoped>
.checkbox-wrapper-46 {
  display: inline-flex;
  align-items: center;
  min-height: 18px;
}

.checkbox-wrapper-46 input[type="checkbox"] {
  display: none;
  visibility: hidden;
}

.checkbox-wrapper-46 .cbx {
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.checkbox-wrapper-46 .cbx span {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

/* BOX CHECKBOX */
.checkbox-wrapper-46 .cbx span:first-child {
  flex-shrink: 0;
  position: relative;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  border-radius: 3px;
  border: 1px solid #9098a9;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

/* SVG CHECK */
.checkbox-wrapper-46 .cbx span:first-child svg {
  position: absolute;
  top: 3px;
  left: 2px;
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 16px;
  stroke-dashoffset: 16px;
  transition: all 0.3s ease;
}

/* RIPPLE */
.checkbox-wrapper-46 .cbx span:first-child:before {
  content: "";
  position: absolute;
  inset: 0;
  background: #506eec;
  transform: scale(0);
  border-radius: 50%;
}

/* LABEL TEXT */
.checkbox-wrapper-46 .cbx span:last-child {
  padding-left: 5px;
  line-height: 1.2;
}

/* HOVER */
.checkbox-wrapper-46 .cbx:hover span:first-child {
  border-color: #506eec;
}

/* CHECKED STATE */
.checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child {
  background: #506eec;
  border-color: #506eec;
  animation: wave-46 0.4s ease;
}

/* CHECK ICON ANIMATION */
.checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child svg {
  stroke-dashoffset: 0;
}

/* WAVE ANIMATION */
@keyframes wave-46 {
  50% {
    transform: scale(0.9);
  }
}

/* SAFETY (agar tidak kepotong di table/flex/grid) */
.checkbox-wrapper-46,
.checkbox-wrapper-46 * {
  overflow: visible;
}
</style>