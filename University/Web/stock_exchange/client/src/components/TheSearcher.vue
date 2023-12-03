<template>
    <input placeholder="Найти" @keyup="$emit('output', $event)">
</template>

<script>
export default{
}
</script>

<style scoped>
    input{
        width: 1780px;
        height: 40px;
        flex-shrink: 0;
        border-radius: 10px;
        font-size: 16px;
        border: 0px;
        background: #F3F3F3;
        margin: 10px;
        background-position: 10px 10px;
        background-image: url('/public/search.svg');
        background-repeat: no-repeat;
        padding-left: 40px;
        font-family: JejuHallasan;
    }
</style>