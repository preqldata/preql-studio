<template>
    <footer class="d-flex pa-0 ba-0 footer row">
        <slot/>
    </footer>
</template>
<style scoped>
.footer {
    --height: 20px;
    font-size: 0.8rem;
    background-color: black;
    height: var(--height);
    min-height: var(--height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: var(--text-lighter);
}
</style>
<script lang="ts">
export default {
    name: "FooterComponent",
    data: () => ({
        icons: [
        ],
    }),
}
</script>