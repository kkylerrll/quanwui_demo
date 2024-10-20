<template>
  <div class="pagination flex items-center justify-center gap-2">
    <PaginationButton
      :disabled="currentPage === 1"
      :onClick="goToPreviousPage"
    >
      <svgIcon name="left" />
    </PaginationButton>

    <div class="page-numbers flex items-center gap-2">
      <span
        v-for="page in displayedPage"
        :key="page"
      >
        <button
          :class="['numBtn', { active: currentPage === page }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </span>
    </div>

    <PaginationButton
      :disabled="currentPage === pageCount"
      :onClick="goToNextPage"
    >
      <svgIcon name="right" />
    </PaginationButton>
    <div class="flex justify-center items-center gap-2.5">
      <p>跳至</p>
      <input
        v-model.number="pageInput"
        type="number"
        class="jumpBtn text-center"
        :placeholder="'跳轉至第幾頁'"
        @keyup.enter="goToPage(pageInput)"
      />
      <p>頁</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PaginationButton from './PaginationButton.vue'; // 引入上一頁/下一頁按鈕組件

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['pageChange']);
const currentPage = ref(1);
const pageInput = ref(currentPage.value);

const pageCount = computed(() => Math.ceil(props.total / props.pageSize));
// 監控 currentPage 的變化，以便同步更新輸入框
watch(currentPage, (newPage) => {
  pageInput.value = newPage;
});

const displayedPage = computed(() => {
  const pages = [];
  const total = pageCount.value;

  // 當總頁數小於或等於 10 時，顯示所有頁碼
  if (total <= 10) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 當前頁在前三頁
    if (currentPage.value <= 3) {
      pages.push(1, 2, 3, 4, '...', total);
    }
    // 當前頁在最後三頁
    else if (currentPage.value >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total);
    }
    // 當前頁在中間
    else {
      pages.push(
        1,
        '...',
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        '...',
        total,
      );
    }
  }
  return pages;
});

const goToPage = (page) => {
  if (page > 0 && page <= pageCount.value) {
    currentPage.value = page;
    pageInput.value = page; // 更新輸入框
    emit('pageChange', page); // 發出分頁變更事件
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const goToNextPage = () => {
  if (currentPage.value < pageCount.value) {
    goToPage(currentPage.value + 1);
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';

.pagination {
  padding: 10px;
}
.numBtn {
  padding: 8px 12px;
  border: 1px solid #a7a7a7;
  border-radius: 50px;
  color: #a7a7a7;
}
.numBtn.active {
  background-color: $primary-color;
  border: none;
  color: white;
}
.jumpBtn {
  border: 1px solid #a7a7a7;
  border-radius: 5px;
  max-width: 50px;
  padding: 4px;
}
</style>
