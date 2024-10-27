<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      close-on-click
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="flat"
          :text="dateRangeText"
        >
          <template #append>
            <v-icon color="white">mdi-calendar-blank</v-icon>
          </template>
        </v-btn>
      </template>

      <v-date-picker
        v-model="dates"
        hide-header
        class="datePicker mt-4"
        show-adjacent-months
        show-current
        scrollable
        rounded
        elevation="5"
        :max="new Date()"
      >
        <template #actions>
          <v-btn
            color="primary"
            variant="text"
            :text="$t('cancel')"
            @click="cancel"
          />
          <v-btn
            color="primary"
            variant="text"
            :text="$t('ok')"
            @click="save"
          />
        </template>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script setup>
import { computed, ref, unref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const range = ref([]);
const menu = ref(false);
const model = ref([]);
const dates = computed({
  get: datesBetween,
  set: updateRange,
});

const dateRangeText = computed(() => {
  if (model.value == undefined || model.value.length == 0) {
    return t('date_range_picker.selection');
  }
  const [start, end] = unref(model);
  if (!!start && !!end) {
    return `${t('date_range_picker.from')} ${start.toLocaleDateString()} ${t(
      'date_range_picker.to',
    )} ${end.toLocaleDateString()}`;
  } else if (isToday(start)) {
    return t('date_range_picker.today');
  } else {
    return start.toLocaleDateString();
  }
});

function updateRange(date) {
  const [start, end] = unref(range);
  //if everything is null or everything is not
  if (!!start === !!end) {
    range.value = [date];
  } else if (date < start) {
    range.value = [date, start];
  } else if (date > start) {
    range.value = [start, date];
  }
}

function datesBetween() {
  if (range.value == undefined) {
    return [];
  }
  const [start, end] = unref(range);
  if (!!start && !!end) {
    const between = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      between.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return between;
  } else {
    return range.value;
  }
}

function isToday(date) {
  const today = new Date(Date.now());
  today.setHours(0, 0, 0, 0);
  return today.getTime() == date.getTime();
}

function save() {
  model.value = range.value;
  menu.value = false;
}

function cancel() {
  range.value = model.value || [];
  menu.value = false;
}
</script>
