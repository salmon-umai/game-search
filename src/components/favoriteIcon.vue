<template>
    <svg :width="width" :height="height" :fill="active ? '#e64e7b' : 'none'" :stroke="active ? '#e64e7b' : color"
        viewBox="0 0 32 34" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M28.2638 4.2039C27.5552 3.34668 26.7139 2.66668 25.7879 2.20274C24.8619 1.73879 23.8694 1.5 22.867 1.5C21.8647 1.5 20.8722 1.73879 19.9462 2.20274C19.0202 2.66668 18.1788 3.34668 17.4702 4.2039L15.9996 5.98209L14.529 4.2039C13.0977 2.4732 11.1564 1.5009 9.13223 1.5009C7.10804 1.5009 5.16675 2.4732 3.73543 4.2039C2.30411 5.9346 1.5 8.28193 1.5 10.7295C1.5 13.1771 2.30411 15.5244 3.73543 17.2551L5.20602 19.0333L15.9996 32.0846L26.7932 19.0333L28.2638 17.2551C28.9728 16.3983 29.5351 15.381 29.9188 14.2613C30.3025 13.1416 30.5 11.9415 30.5 10.7295C30.5 9.51751 30.3025 8.31739 29.9188 7.1977C29.5351 6.07802 28.9728 5.06071 28.2638 4.2039Z"
            :stroke="color" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>

<script setup>
const props = defineProps({
    width: {
        type: [Number, String],
        default: 32,
    },
    height: {
        type: [Number, String],
        default: 34,
    },
    color: {
        type: String,
        default: '#e64e7b',
    },
    active: {
        type: Boolean,
        default: false,
    },
});
</script>
